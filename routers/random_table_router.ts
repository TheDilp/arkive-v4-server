import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertRandomTableSchema, ReadRandomTableSchema, UpdateRandomTableSchema } from "../database/validation/random_tables";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetBreadcrumbs, GetEntityChildren } from "../utils/relationalQueryHelpers";

export function random_table_router(app: Elysia) {
  return app.group("/random_tables", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const { id } = await tx.insertInto("random_tables").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations) {
              if (body.relations?.random_table_options) {
                const { random_table_options } = body.relations;
                const withParentId = random_table_options.map((opt) => {
                  opt.data.parent_id = id;
                  return opt.data;
                });
                await tx.insertInto("random_table_options").values(withParentId).execute();
              }
            }
          });
          return { message: `Random table ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertRandomTableSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("random_tables")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "random_tables">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("random_tables", qb, body.filters);
              return qb;
            })
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db

            .selectFrom("random_tables")
            .where("random_tables.id", "=", params.id)
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "random_tables"),
            )
            .$if(!!body?.relations?.random_table_options, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("random_table_options")
                    .whereRef("random_table_options.parent_id", "=", "random_tables.id")
                    .select([
                      "random_table_options.id",
                      "random_table_options.title",
                      "random_table_options.description",
                      "random_table_options.icon",
                      "random_table_options.icon_color",
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("random_table_suboptions")
                            .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                            .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                        ).as("random_table_suboptions"),
                    ]),
                ).as("random_table_options"),
              ),
            )

            .select([
              "random_tables.id",
              "random_tables.title",
              "random_tables.icon",
              "random_tables.is_folder",
              "random_tables.is_public",
              "random_tables.parent_id",
              "random_tables.description",
            ])
            .executeTakeFirstOrThrow();

          if (body?.relations?.parents) {
            const parents = await GetBreadcrumbs({ db, id: params.id, table_name: "random_tables" });
            return { data: { ...data, parents }, message: "Success.", ok: true };
          }

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadRandomTableSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("random_tables").where("id", "=", params.id).set(body.data).execute();

          return { message: `Random table ${MessageEnum.successfully_updated}.`, ok: true };
        },
        {
          body: UpdateRandomTableSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("random_tables").where("id", "=", params.id).execute();
          return { message: `Random table ${MessageEnum.successfully_deleted}`, ok: true };
        },
        { response: ResponseSchema },
      ),
  );
}
