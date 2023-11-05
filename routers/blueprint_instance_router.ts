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
import { CreateTagRelations, GetRelationsForUpdating, TagQuery } from "../utils/relationalQueryHelpers";

export function blueprint_instance_router(app: Elysia) {
  return app.group("/blueprint_instances", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const newInstance = await tx
              .insertInto("blueprint_instances")
              .values(body.data)
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.blueprint_fields?.length) {
              const { blueprint_fields } = body.relations;
              await tx
                .insertInto("blueprint_instance_to_blueprint_fields")
                .values(
                  blueprint_fields.map((field) => ({
                    blueprint_field_id: field.id,
                    value: JSON.stringify(field.value?.value),
                    blueprint_instance_id: newInstance.id,
                  })),
                )
                .executeTakeFirst();
            }

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
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprint_instances">[]),
            )
            .$if(!!body.data?.parent_id, (qb) => {
              if (body.data?.parent_id) return qb.where("blueprint_instances.parent_id", "=", body.data.parent_id);
              return qb;
            })
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("blueprint_fields")
                  .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                  .select([
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("blueprint_instance_to_blueprint_fields")
                          .select(["blueprint_field_id as id", "value"])
                          .whereRef("blueprint_instance_to_blueprint_fields.blueprint_field_id", "=", "blueprint_fields.id")
                          .whereRef(
                            "blueprint_instance_to_blueprint_fields.blueprint_instance_id",
                            "=",
                            "blueprint_instances.id",
                          ),
                      ).as("value"),
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("random_tables")
                          .select([
                            "id",
                            "title",
                            (ebb) =>
                              jsonArrayFrom(
                                ebb
                                  .selectFrom("random_table_options")
                                  .leftJoin(
                                    "blueprint_instance_to_blueprint_fields as bibf",
                                    "bibf.blueprint_field_id",
                                    "blueprint_fields.id",
                                  )
                                  .where(({ eb: wbb, ref }) =>
                                    // This works, typescript is being a bitch
                                    // @ts-ignore
                                    wbb(ref("bibf.value", "->>").at(0), "=", ref("random_table_options.id")),
                                  )
                                  .select([
                                    "random_table_options.id",
                                    "random_table_options.title",
                                    (ebbb) =>
                                      jsonArrayFrom(
                                        ebbb
                                          .selectFrom("random_table_suboptions")
                                          .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                                          .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                                      ).as("suboptions"),
                                  ])
                                  .whereRef("random_table_options.parent_id", "=", "blueprint_fields.random_table_id"),
                              ).as("random_table_options"),
                          ])

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
            )
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("blueprint_instances", qb, body.filters);
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
            .select((eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom("blueprints")
                  .whereRef("blueprints.id", "=", "blueprint_instances.parent_id")
                  .select(["title", "title_name"]),
              ).as("blueprint"),
            )
            .$if(!!body?.relations?.blueprint_fields, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("blueprint_fields")
                    .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                    .select([
                      "blueprint_fields.id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("blueprint_instance_to_blueprint_fields")
                            .select(["blueprint_field_id as id", "value"])
                            .whereRef("blueprint_instance_to_blueprint_fields.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_to_blueprint_fields.blueprint_instance_id", "=", params.id),
                        ).as("value"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select([
                              "id",
                              "title",
                              (ebb) =>
                                jsonArrayFrom(
                                  ebb
                                    .selectFrom("random_table_options")
                                    .leftJoin(
                                      "blueprint_instance_to_blueprint_fields as bibf",
                                      "bibf.blueprint_field_id",
                                      "blueprint_fields.id",
                                    )
                                    .where(({ eb: wbb, ref }) =>
                                      // This works, typescript is being a bitch
                                      // @ts-ignore
                                      wbb(ref("bibf.value", "->>").at(0), "=", ref("random_table_options.id")),
                                    )
                                    .select([
                                      "random_table_options.id",
                                      "random_table_options.title",
                                      (ebbb) =>
                                        jsonArrayFrom(
                                          ebbb
                                            .selectFrom("random_table_suboptions")
                                            .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                                            .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                                        ).as("suboptions"),
                                    ])
                                    .whereRef("random_table_options.parent_id", "=", "blueprint_fields.random_table_id"),
                                ).as("random_table_options"),
                            ])

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
          await db.transaction().execute(async (tx) => {
            tx.updateTable("blueprint_instances")
              .set(body.data)
              .where("blueprint_instances.id", "=", params.id)
              .executeTakeFirstOrThrow();

            if (body.relations?.blueprint_fields) {
              const existingBlueprintFields = await tx
                .selectFrom("blueprint_instance_to_blueprint_fields")
                .select([
                  "blueprint_instance_to_blueprint_fields.blueprint_field_id as id",
                  "blueprint_instance_to_blueprint_fields.value",
                ])
                .where("blueprint_instance_to_blueprint_fields.blueprint_instance_id", "=", params.id)
                .execute();
              const existingIds = existingBlueprintFields.map((field) => field.id);
              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds,
                body.relations?.blueprint_fields,
              );

              if (idsToRemove.length) {
                await tx
                  .deleteFrom("blueprint_instance_to_blueprint_fields")
                  .where("blueprint_field_id", "in", idsToRemove)
                  .execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("blueprint_instance_to_blueprint_fields")
                  .values(
                    itemsToAdd.map((item) => ({
                      blueprint_instance_id: params.id,
                      blueprint_field_id: item.id,
                      value: JSON.stringify(item.value.value),
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    await tx
                      .updateTable("blueprint_instance_to_blueprint_fields")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", item.id)
                      .set({ value: JSON.stringify(item.value.value) })
                      .execute();
                  }),
                );
              }
            }
          });

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
