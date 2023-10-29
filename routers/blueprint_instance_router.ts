import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertBlueprintInstanceSchema,
  ListBlueprintInstanceSchema,
  ReadBlueprintInstanceSchema,
  UpdateBlueprintInstanceSchema,
} from "../database/validation/blueprint_instances";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, constructTagFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { CreateTagRelations, TagQuery } from "../utils/relationalQueryHelpers";

export function blueprint_instance_router(app: Elysia) {
  return app.group("/blueprint_instances", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const newInstance = await tx
              .insertInto("blueprint_instances")
              .values({ ...body.data, value: JSON.stringify(body.data.value) })
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.tags?.length) {
              await CreateTagRelations({
                tx,
                relationalTable: "_blueprint_instancesTotags",
                id: newInstance.id,
                tags: body.relations.tags,
              });
            }
          });
          return { message: `Blueprint instance ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertBlueprintInstanceSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("blueprint_instances")
            .where("blueprint_instances.parent_id", "=", body.data.parent_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprint_instances">[]),
            )
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("blueprints", qb, body.filters);
              return qb;
            })
            .$if(!!body?.relationFilters?.tags?.length, (qb) =>
              constructTagFilter(
                "blueprint_instances",
                qb,
                "_blueprint_instancesTotags",
                body?.relationFilters?.tags || [],
                "A",
                "B",
              ),
            )
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListBlueprintInstanceSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("blueprint_instances")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprint_instances">[]),
            )
            .where("blueprint_instances.id", "=", params.id)
            .$if(!!body?.relations?.blueprint_fields, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("blueprint_fields")
                    .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                    .select([
                      "blueprint_fields.id",
                      "blueprint_fields.title",
                      "blueprint_fields.options",
                      "blueprint_fields.field_type",
                      "blueprint_fields.sort",
                      "blueprint_fields.formula",
                      "blueprint_fields.random_table_id",
                      "blueprint_fields.calendar_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select(["id", "title"])
                            .whereRef("random_tables.id", "=", "blueprint_fields.random_table_id"),
                        ).as("random_table"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select(["id", "title"])
                            .whereRef("calendars.id", "=", "blueprint_fields.calendar_id"),
                        ).as("calendar"),
                    ]),
                ).as("blueprint_fields"),
              ),
            )

            .$if(!!body?.relations?.tags, (qb) =>
              qb.select((eb) => TagQuery(eb, "_blueprint_instancesTotags", "blueprint_instances")),
            )
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadBlueprintInstanceSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          const v = JSON.stringify(body.data.value);
          await db
            .updateTable("blueprint_instances")
            .set({ ...body.data, value: v })
            .where("blueprint_instances.id", "=", params.id)
            //   // .$if(!!body?.relations?.tags, (qb) =>
            //   //   qb.select((eb) => TagQuery(eb, "_blueprint_instancesTotags", "blueprint_instances")),
            //   // )
            .executeTakeFirstOrThrow();
          return { message: `Blueprint instance ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateBlueprintInstanceSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("blueprint_instances").where("id", "=", params.id).execute();
          return { message: `Blueprint instance ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
