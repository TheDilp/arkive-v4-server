import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import merge from "lodash.merge";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import {
  AutolinkerSchema,
  GenerateDocumentSchema,
  InsertDocumentSchema,
  ListDocumentSchema,
  MentionsInDocumentSchema,
  ReadDocumentSchema,
  UpdateDocumentSchema,
} from "../database/validation/documents";
import { MessageEnum } from "../enums/requestEnums";
import { afterHandler } from "../handlers";
import { MentionType } from "../types/entityTypes";
import { ResponseSchema, ResponseWithDataSchema, SearchableMentionEntities } from "../types/requestTypes";
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
import { findObjectsByType, getCharacterFullName, insertSenderToMessage } from "../utils/transform";

function getAutoLinkerFields(type: "characters" | "documents" | "blueprint_instances" | "maps" | "graphs" | "words") {
  if (type === "characters") return ["id", "full_name as title", "portrait_id as image_id"] as const;
  if (type === "blueprint_instances") return ["id", "title", "parent_id"] as const;
  if (type === "maps" || type === "graphs") return ["id", "title"] as const;
  if (type === "words") return ["id", "title", "parent_id"] as const;
  return ["id", "title", "image_id"] as const;
}

export function document_router(app: Elysia) {
  return app.group("/documents", (server) =>
    server
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
            .$if(!!body.relations?.tags, (qb) => {
              if (body?.relations?.tags) {
                return qb.select((eb) => TagQuery(eb, "_documentsTotags", "documents"));
              }
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
            if (body.data.content) {
              const mentions = findObjectsByType(body.data.content, "mentionAtom");
              const uniqueMentionIds = uniq(mentions.map((mention: MentionType) => mention?.attrs?.id).filter((id) => !!id));
              if (uniqueMentionIds.length) {
                const existingMentions = await tx
                  .selectFrom("document_mentions")
                  .where("document_mentions.parent_document_id", "=", params.id)
                  .select(["document_mentions.mention_id"])
                  .execute();

                const existingMentionIds = existingMentions.map((item) => item.mention_id);

                const idsToDelete = existingMentionIds.filter((id) => !uniqueMentionIds.includes(id));
                const mentionsToInsert = uniqBy(
                  mentions.filter((m) => uniqueMentionIds.includes(m.attrs.id)),
                  "attrs.id",
                );

                if (idsToDelete.length)
                  await tx.deleteFrom("document_mentions").where("document_mentions.mention_id", "in", idsToDelete).execute();

                if (mentionsToInsert.length)
                  await tx
                    .insertInto("document_mentions")
                    .values(
                      mentionsToInsert.map((mention) => ({
                        parent_document_id: params.id,
                        mention_id: mention.attrs.id,
                        mention_type: mention.attrs.name,
                      })),
                    )
                    .execute();
              } else {
                await tx
                  .deleteFrom("document_mentions")
                  .where("document_mentions.parent_document_id", "=", params.id)
                  .execute();
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
          const splitWords = uniq(`${body.data.text}`.split(" ")).filter(
            (word) => !!word && word.length > 1 && !["the", "a", "an", "and", "or", "of", "in", "out", "at"].includes(word),
          );
          // .map((word) => `${word.replaceAll("'", "\'")}`);

          const string = splitWords.join(" | ");

          const formattedString = `(${string}) ${body.data.ignore ? `& ! '${body.data.ignore}'` : ""}`;
          const fields = getAutoLinkerFields(body.data.type);
          const res = await db
            .selectFrom(body.data.type)
            .select(fields)
            .$if(body.data.type === "blueprint_instances", (qb) => {
              if (body.data.type === "blueprint_instances") {
                qb.leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                  .clearWhere()
                  .where("blueprints.project_id", "=", body.data.project_id);
              }
              return qb;
            })
            .$if(body.data.type === "words", (qb) => {
              if (body.data.type === "words") {
                qb.leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
                  .clearWhere()
                  .where("dictionaries.project_id", "=", body.data.project_id);
              }
              return qb;
            })
            .$if(!["blueprint_instances", "words"].includes(body.data.type), (qb) => {
              return qb.where("project_id", "=", body.data.project_id);
            })
            .where("ts", "@@", sql`to_tsquery(${sql.lit("english")}, ${formattedString})`)
            .execute();

          return { data: res, message: MessageEnum.success, ok: true };
        },
        { body: AutolinkerSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/mentions_in_document",
        async ({ body }) => {
          const res = await Promise.all(
            Object.entries(body.data.mentions).map(async ([type, mentions]) =>
              db
                .selectFrom(type as SearchableMentionEntities)
                .select(type === "characters" ? ["id", "full_name as title", "portrait_id as image_id"] : ["id", "title"])
                .where(
                  "id",
                  "in",
                  mentions.map((m) => m.id),
                )
                .execute(),
            ),
          );
          return { data: Object.values(res).flatMap((m) => m), message: MessageEnum.success, ok: true };
        },
        { body: MentionsInDocumentSchema, response: ResponseWithDataSchema },
      )
      .get(
        "/mentioned_in/:id",
        async ({ params }) => {
          const nodes = await db
            .selectFrom("document_mentions")
            .distinctOn("document_mentions.parent_document_id")
            .leftJoin("documents", "documents.id", "document_mentions.parent_document_id")
            .select(["documents.id", "documents.title", "documents.icon"])
            .where("mention_id", "=", params.id)
            .execute();

          const edges = nodes.map((d) => ({ source_id: d.id, target_id: params.id }));

          return { data: { nodes, edges }, message: MessageEnum.success, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .get("/mentions/:project_id", async ({ params }) => {
        const { project_id } = params;

        const connections = await db
          .selectFrom("document_mentions")
          .select(["parent_document_id as source_id", "mention_id as target_id"])
          .leftJoin("documents as sources", "sources.id", "document_mentions.parent_document_id")
          .leftJoin("documents as targets", "targets.id", "document_mentions.mention_id")
          .where("sources.project_id", "=", project_id)
          .where("targets.project_id", "=", project_id)
          .execute();

        const nodes = new Set(connections.flatMap((c) => [c.source_id, c.target_id]));
        const finalNodes =
          nodes.size > 0
            ? await db.selectFrom("documents").select(["id", "title", "icon"]).where("id", "in", Array.from(nodes)).execute()
            : [];

        return { data: { nodes: finalNodes, edges: connections }, message: MessageEnum.success, ok: true };
      })
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
