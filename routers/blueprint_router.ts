import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import { InsertBlueprintSchema, ListBlueprintSchema, ReadBlueprintSchema, UpdateBlueprintSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelationsForUpdating } from "../utils/relationalQueryHelpers";

export function blueprint_router(app: Elysia) {
  return app.group("/blueprints", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const newTemplate = await tx.insertInto("blueprints").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body.relations?.blueprint_fields) {
              await tx
                .insertInto("blueprint_fields")
                .values(
                  body.relations.blueprint_fields.map((field) => ({
                    ...field,
                    parent_id: newTemplate.id,
                    options: JSON.stringify(field.options || []),
                  })),
                )
                .execute();
            }
            // if (body.relations?.tags) {
            //   await CreateTagRelations({
            //     tx,
            //     relationalTable: "_blueprint_fields_templatesTotags",
            //     id: newTemplate.id,
            //     tags: body.relations.tags,
            //   });
            // }
          });
          return { message: `Blueprint ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertBlueprintSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("blueprints")
            .where("blueprints.project_id", "=", body.data.project_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprints">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("blueprints", qb, body.filters);
              return qb;
            })
            // .$if(!!body?.relationFilters?.tags?.length, (qb) =>
            //   constructTagFilter(
            //     "blueprint_fields_templates",
            //     qb,
            //     "_blueprint_fields_templatesTotags",
            //     body?.relationFilters?.tags || [],
            //     "A",
            //     "B",
            //   ),
            // )
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.blueprint_fields) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("blueprint_fields")
                      .whereRef("blueprints.id", "=", "blueprint_fields.parent_id")
                      .select([
                        "blueprint_fields.id",
                        "blueprint_fields.title",
                        "blueprint_fields.field_type",
                        "blueprint_fields.options",
                        "blueprint_fields.formula",
                        "blueprint_fields.random_table_id",
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("random_tables")
                              .select(["random_tables.id", "random_tables.title"])
                              .whereRef("random_tables.id", "=", "blueprint_fields.random_table_id"),
                          ).as("random_table"),
                        (eb) =>
                          jsonArrayFrom(
                            eb
                              .selectFrom("random_table_options")
                              .select([
                                "random_table_options.id",
                                "random_table_options.title",
                                (ebb) =>
                                  jsonArrayFrom(
                                    ebb
                                      .selectFrom("random_table_suboptions")
                                      .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                                      .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                                  ).as("suboptions"),
                              ])
                              .whereRef("random_table_options.parent_id", "=", "blueprint_fields.random_table_id"),
                          ).as("random_table_options"),

                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("calendars")
                              .select([
                                "calendars.id",
                                "calendars.title",
                                "calendars.days",
                                (sb) =>
                                  jsonArrayFrom(
                                    sb.selectFrom("months").select(["months.id", "months.title", "months.days"]),
                                  ).as("months"),
                              ])
                              .whereRef("calendars.id", "=", "blueprint_fields.calendar_id"),
                          ).as("calendar"),
                      ])
                      .orderBy("sort"),
                  ).as("blueprint_fields"),
                );
              }
              // if (body?.relations?.tags) {
              //   qb = qb.select((eb) => TagQuery(eb, "_blueprint_fields_templatesTotags", "blueprint_fields_templates"));
              // }
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListBlueprintSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("blueprints")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprints">[]))
            .where("blueprints.id", "=", params.id)
            .$if(!!body?.relations?.blueprint_fields, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("blueprint_fields")
                    .whereRef("blueprint_fields.parent_id", "=", "blueprints.id")
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
                            .$if(!!body?.relations?.random_table_options, (qb) =>
                              qb.select(
                                jsonArrayFrom(
                                  eb
                                    .selectFrom("random_table_options")
                                    .select([
                                      "random_table_options.id",
                                      "random_table_options.title",
                                      (ebb) =>
                                        jsonArrayFrom(
                                          ebb
                                            .selectFrom("random_table_suboptions")
                                            .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                                            .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                                        ).as("suboptions"),
                                    ])
                                    .whereRef("random_table_options.parent_id", "=", "blueprint_fields.random_table_id"),
                                ).as("random_table_options"),
                              ),
                            )
                            .whereRef("random_tables.id", "=", "blueprint_fields.random_table_id"),
                        ).as("random_table"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select(["id", "title"])
                            .whereRef("calendars.id", "=", "blueprint_fields.calendar_id"),
                        ).as("calendar"),
                    ])
                    .orderBy("sort"),
                ).as("blueprint_fields"),
              ),
            )
            .$if(!!body?.relations?.blueprint_instances, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("blueprint_instances")
                    .whereRef("blueprint_instances.parent_id", "=", "blueprints.id")
                    .select(["blueprint_instances.id", "blueprint_instances.parent_id", "blueprint_instances.value"]),
                ).as("blueprint_instances"),
              ),
            )

            // .$if(!!body?.relations?.tags, (qb) =>
            //   qb.select((eb) => TagQuery(eb, "_blueprint_fields_templatesTotags", "blueprint_fields_templates")),
            // )
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadBlueprintSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          if (body.data) {
            await db.transaction().execute(async (tx) => {
              if (body.data) {
                await tx
                  .updateTable("blueprints")
                  .set(body.data)
                  .where("blueprints.id", "=", params.id)
                  .executeTakeFirstOrThrow();
              }
              if (body?.relations?.blueprint_fields) {
                const { blueprint_fields } = body.relations;
                const existingBlueprintFields = await tx
                  .selectFrom("blueprint_fields")
                  .select(["id", "parent_id"])
                  .where("blueprint_fields.parent_id", "=", params.id)
                  .execute();

                const existingIds = existingBlueprintFields.map((field) => field.id);

                const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, blueprint_fields);

                if (idsToRemove.length) {
                  await tx.deleteFrom("blueprint_fields").where("id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("blueprint_fields")
                    .values(
                      // @ts-ignore
                      itemsToAdd.map((field) => ({
                        ...omit(field, ["id"]),
                        options: JSON.stringify(field.options || []),
                        parent_id: params.id,
                      })),
                    )
                    .execute();
                }
                if (itemsToUpdate.length) {
                  await Promise.all(
                    itemsToUpdate.map(async (item) =>
                      tx
                        .updateTable("blueprint_fields")
                        .where("blueprint_fields.id", "=", item.id as string)
                        .set({ ...omit(item, ["id"]), options: JSON.stringify(item.options || []) })
                        .execute(),
                    ),
                  );
                }
              }
            });
          }

          return { message: `Template ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateBlueprintSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("blueprints").where("id", "=", params.id).execute();
          return { message: `Blueprint ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
