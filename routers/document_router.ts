import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import {
  InsertDocumentSchema,
  ListDocumentSchema,
  ReadDocumentSchema,
  UpdateDocumentSchema,
} from "../database/validation/documents";
import { MessageEnum } from "../enums/requestEnums";
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

export function document_router(app: Elysia) {
  return app.group("/documents", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
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
          return { message: `Document ${MessageEnum.successfully_updated}.`, ok: true };
        },
        {
          body: UpdateDocumentSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("documents").where("documents.id", "=", params.id).execute();
        return { message: `Document ${MessageEnum.successfully_deleted}.`, ok: true };
      }),
  );
}
