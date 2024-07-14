import Elysia from "elysia";
import { ExpressionBuilder, SelectExpression, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import groupBy from "lodash.groupby";

import { db } from "../database/db";
import {
  InsertRandomTableOptionSchema,
  ListRandomTableOptionRandomManySchema,
  ListRandomTableOptionsByParentSchema,
  ListRandomTableOptionsSchema,
  ReadRandomTableOptionSchema,
  UpdateRandomTableOptionSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { GetRelationsForUpdating } from "../utils/relationalQueryHelpers";
import { chooseRandomItems } from "../utils/utils";

export function random_table_option_router(app: Elysia) {
  return app.group("/random_table_options", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            await tx
              .insertInto("random_table_options")
              .values(body.data.map((opt) => opt.data))
              .execute();

            if (body?.relations?.random_table_suboptions) {
              const { random_table_suboptions } = body.relations;
              if (random_table_suboptions?.length) {
                await tx
                  .insertInto("random_table_suboptions")
                  .values(random_table_suboptions.map((subopt) => subopt.data))
                  .execute();
              }
            }
          });

          return { message: `Random table options ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertRandomTableOptionSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          let query = db
            .selectFrom("random_table_options")
            .select(body.fields as SelectExpression<DB, "random_table_options">[])

            .$if(!!body.relations?.random_table_suboptions, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("random_table_suboptions")
                    .select([
                      "random_table_suboptions.id",
                      "random_table_suboptions.title",
                      "random_table_suboptions.description",
                    ])
                    .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                ).as("random_table_suboptions"),
              ),
            )
            .where("random_table_options.parent_id", "=", body.data.parent_id);

          if (body.orderBy?.length && body.orderBy[0].field === "title") {
            if (body.orderBy[0].sort === "asc") {
              query = query
                .orderBy(
                  (ob: ExpressionBuilder<DB, "random_table_options">) =>
                    sql`NULLIF(regexp_replace(${ob.ref("random_table_options.title")}, '\\D.*', ''), '')::int asc`,
                )
                .orderBy(
                  (ob: ExpressionBuilder<DB, "random_table_options">) =>
                    sql`regexp_replace(${ob.ref("random_table_options.title")}, '^\\d+\\s+', '') asc`,
                );
            } else {
              query = query
                .orderBy(
                  (ob: ExpressionBuilder<DB, "random_table_options">) =>
                    sql`NULLIF(regexp_replace(${ob.ref("random_table_options.title")}, '\\D.*', ''), '')::int desc`,
                )
                .orderBy(
                  (ob: ExpressionBuilder<DB, "random_table_options">) =>
                    sql`regexp_replace(${ob.ref("random_table_options.title")}, '^\\d+\\s+', '') desc`,
                );
            }
          }

          const data = await query.execute();
          return { data, message: "Success", ok: true, role_access: true };
        },
        {
          body: ListRandomTableOptionsSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db

            .selectFrom("random_table_options")
            .where("random_table_options.id", "=", params.id)
            .select([
              "random_table_options.id",
              "random_table_options.title",
              "random_table_options.description",
              "random_table_options.icon",
              "random_table_options.parent_id",
            ])

            .$if(!!body.relations?.random_table_suboptions, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("random_table_suboptions")
                    .selectAll()
                    .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                ).as("random_table_suboptions"),
              ),
            )
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadRandomTableOptionSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/random/:table_id",
        async ({ params, body }) => {
          const options = await db
            .selectFrom("random_table_options")
            .select([
              "random_table_options.id",
              "random_table_options.title",
              (eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("random_table_suboptions")
                    .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                    .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                ).as("random_table_suboptions"),
            ])
            .where("random_table_options.parent_id", "=", params.table_id)
            .execute();
          if (body.data.count > options.length) {
            return { message: "More items requested than there are available.", ok: false, role_access: true };
          }

          const data = chooseRandomItems(options, body.data.count);
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListRandomTableOptionsByParentSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/random/many",
        async ({ body }) => {
          const tableIdsToFetch = body.data.map((table) => table.table_id);
          const tables = await db
            .selectFrom("random_table_options")
            .select([
              "id",
              "title",
              "parent_id",
              (eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("random_table_suboptions")
                    .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                    .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                ).as("random_table_suboptions"),
            ])
            .where("random_table_options.parent_id", "in", tableIdsToFetch)
            .execute();
          const groupedOptions = groupBy(tables, "parent_id");

          const data = [];
          for (let i = 0; i < tableIdsToFetch.length; i++) {
            const currentTableId = tableIdsToFetch[i];
            const options = groupedOptions[currentTableId];
            const chosenOptions = chooseRandomItems(options, body.data[i].count ?? 1);
            data.push({
              random_table_id: currentTableId,
              random_table: chosenOptions,
            });
          }

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListRandomTableOptionRandomManySchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            await tx.updateTable("random_table_options").where("id", "=", params.id).set(body.data).execute();

            if (body?.relations?.random_table_suboptions) {
              const existingIds = await tx
                .selectFrom("random_table_suboptions")
                .select(["id"])
                .where("parent_id", "=", params.id)
                .execute();

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds.map((item) => item.id),
                body.relations.random_table_suboptions.map((subopt) => subopt.data),
              );

              if (idsToRemove.length) {
                await tx.deleteFrom("random_table_suboptions").where("id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("random_table_suboptions")
                  .values(
                    itemsToAdd.map((item) => ({
                      parent_id: params.id,
                      title: item.title,
                      description: item?.description,
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    await tx
                      .updateTable("random_table_suboptions")
                      .where("parent_id", "=", params.id)
                      .where("id", "=", item.id)
                      .set(item)
                      .execute();
                  }),
                );
              }
            }
          });

          return { message: `Random table option ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        {
          body: UpdateRandomTableOptionSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("random_table_options").where("id", "=", params.id).execute();
          return { message: `Random table option ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        { response: ResponseSchema },
      ),
  );
}
