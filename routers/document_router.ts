import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import merge from "lodash.merge";
import uniq from "lodash.uniq";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import {
  AutolinkerSchema,
  GenerateDocumentSchema,
  InsertDocumentSchema,
  ListDocumentSchema,
  ReadDocumentSchema,
  UpdateDocumentSchema,
} from "../database/validation/documents";
import { MessageEnum } from "../enums/requestEnums";
import { afterHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateTagRelations,
  GetBreadcrumbs,
  GetEntityChildren,
  GetRelationsForUpdating,
  TagQuery,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getCharacterFullName, insertSenderToMessage } from "../utils/transform";

function getAutoLinkerFields(type: "documents" | "characters") {
  if (type === "characters") return ["id", "full_name as title", "portrait_id as image_id"] as const;
  return ["id", "title", "image_id"] as const;
}

export function document_router(app: Elysia) {
  return app.group("/documents", (server) =>
    server
      .state("auth", { userId: "" })
      .post(
        "/create",
        async ({ body, request }) => {
          await db.transaction().execute(async (tx) => {
            const document = await tx.insertInto("documents").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body.relations?.alter_names?.length) {
              const { alter_names } = body.relations;
              await tx
                .insertInto("alter_names")
                .values(
                  alter_names.map((alter_name) => ({
                    title: alter_name.title,
                    project_id: body.data.project_id,
                    parent_id: document.id,
                  })),
                )
                .execute();
            }
            if (body.relations?.tags?.length) {
              const { tags } = body.relations;
              await CreateTagRelations({ tx, relationalTable: "_documentsTotags", id: document.id, tags });
            }
          });
          const token = request.headers.get("authorization");
          if (token) afterHandler(body.data, "documents", token, "create");
          return { message: `Document ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertDocumentSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("documents")
            .where("documents.project_id", "=", body?.data?.project_id)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "documents">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("documents", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))

            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("documents")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "documents">[]))
            .where("documents.id", "=", params.id)
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_documentsTotags", "documents"));
              }
              if (body?.relations?.alter_names) {
                qb = qb.select((eb) => {
                  return jsonArrayFrom(
                    eb
                      .selectFrom("alter_names")
                      .select(["alter_names.id", "alter_names.title"])
                      .where("parent_id", "=", params.id),
                  ).as("alter_names");
                });
              }

              return qb;
            })
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "documents"),
            )
            .executeTakeFirstOrThrow();

          if (body?.relations?.parents) {
            const parents = await GetBreadcrumbs({ db, id: params.id, table_name: "documents" });
            return { data: { ...data, parents }, message: MessageEnum.success, ok: true };
          }
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await tx.updateTable("documents").where("documents.id", "=", params.id).set(body.data).execute();
            }
            if (body.relations?.tags) {
              await UpdateTagRelations({
                relationalTable: "_documentsTotags",
                id: params.id,
                newTags: body.relations.tags,
                tx,
              });
            }
            if (body.relations?.alter_names) {
              const existingAlterNames = await tx
                .selectFrom("alter_names")
                .select(["id", "title"])
                .where("parent_id", "=", params.id)
                .execute();

              const existingIds = existingAlterNames.map((field) => field.id);

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds,
                body.relations?.alter_names,
              );
              if (idsToRemove.length) {
                await tx.deleteFrom("alter_names").where("id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("alter_names")
                  .values(
                    itemsToAdd.map((item) => ({
                      project_id: item.project_id,
                      parent_id: params.id,
                      title: item.title,
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) =>
                    tx
                      .updateTable("alter_names")
                      .where("parent_id", "=", params.id)
                      .where("id", "=", item.id)
                      .set({ title: item.title })
                      .execute(),
                  ),
                );
              }
            }
          });
          return { message: `Document ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateDocumentSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/generate/:type",
        async ({ params, body }) => {
          if (body.data.content) {
            const { id } = await db.insertInto("documents").values(body.data).returning("id").executeTakeFirstOrThrow();
            return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true };
          }
          if (params.type === "conversations" && body.data.parent_id) {
            const messages = await db
              .selectFrom("messages")
              .leftJoin("characters", "characters.id", "messages.sender_id")
              .where("parent_id", "=", body.data.parent_id)
              .select(["content", "sender_id", "characters.first_name", "characters.last_name"])
              .execute();
            const mergedContent = merge(
              messages
                .flatMap((msg) => {
                  // @ts-ignore
                  const c = msg.content?.content;
                  if (msg.sender_id && msg.first_name && c) {
                    insertSenderToMessage(msg?.content as any, {
                      type: "mentionAtom",
                      attrs: {
                        id: msg.sender_id,
                        name: "characters",
                        label: getCharacterFullName(msg.first_name, undefined, msg.last_name),
                        alterId: null,
                        projectId: body.data.project_id,
                      },
                    });
                  }

                  return c;
                })

                .filter((content) => !!content),
            );
            const content = JSON.stringify({ type: "doc", content: mergedContent });

            const { id } = await db
              .insertInto("documents")
              .values({ title: body.data.title, project_id: body.data.project_id, content })
              .returning("id")
              .executeTakeFirstOrThrow();
            return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true };
          }
          return { data: [], ok: false, message: "error" };
        },
        { body: GenerateDocumentSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/autolink",
        async ({ body }) => {
          const splitWords = uniq(`${body.data.text}`.split(" "))
            .filter((word) => !!word && !["the", "a", "an", "and", "or", "of", "in", "out", "at"].includes(word))
            .map((word) => `${word}`);

          const string = splitWords.join(" | ");

          const formattedString = `(${string}) ${body.data.ignore ? `& ! '${body.data.ignore}'` : ""}`;
          const fields = getAutoLinkerFields(body.data.type);
          const res = await db
            .selectFrom(body.data.type)
            .select(fields)
            .where("project_id", "=", body.data.project_id)

            .where("ts", "@@", sql`to_tsquery(${sql.lit("english")}, ${formattedString})`)
            .execute();

          return { data: res, message: MessageEnum.success, ok: true };
        },
        { body: AutolinkerSchema, response: ResponseWithDataSchema },
      )
      .delete("/:id", async ({ params, request }) => {
        const data = await db
          .deleteFrom("documents")
          .where("documents.id", "=", params.id)
          .returning(["title", "project_id"])
          .executeTakeFirstOrThrow();
        const token = request.headers.get("authorization");
        if (token) afterHandler(data, "documents", token, "create");
        return { message: `Document ${MessageEnum.successfully_deleted}.`, ok: true };
      }),
  );
}
