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
import { CreateTagRelations } from "../utils/relationalQueryHelpers";

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
              await Promise.all(
                body.relations.blueprint_fields.map(async (field) => {
                  if (field?.characters?.length) {
                    const { characters } = field;
                    await tx
                      .insertInto("blueprint_instance_characters")
                      .values(
                        characters.map((char) => ({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: char.related_id,
                        })),
                      )
                      .execute();
                    return;
                  }
                  if (field?.blueprint_instances?.length) {
                    const { blueprint_instances } = field;
                    await tx
                      .insertInto("blueprint_instance_blueprint_instances")
                      .values(
                        blueprint_instances.map((char) => ({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: char.related_id,
                        })),
                      )
                      .execute();
                    return;
                  }
                  if (field?.documents?.length) {
                    const { documents } = field;
                    await tx
                      .insertInto("blueprint_instance_documents")
                      .values(
                        documents.map((doc) => ({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: doc.related_id,
                        })),
                      )
                      .execute();
                    return;
                  }
                  if (field?.map_pins?.length) {
                    const { map_pins } = field;
                    await tx
                      .insertInto("blueprint_instance_map_pins")
                      .values(
                        map_pins.map((map_pin) => ({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: map_pin.related_id,
                        })),
                      )
                      .execute();
                    return;
                  }
                  if (field.images?.length) {
                    const { images } = field;
                    await tx
                      .insertInto("blueprint_instance_images")
                      .values(
                        images.map((image) => ({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: image.related_id,
                        })),
                      )
                      .execute();
                    return;
                  }
                  if (field?.random_table) {
                    const { random_table } = field;
                    await tx
                      .insertInto("blueprint_instance_random_tables")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: newInstance.id,
                        related_id: random_table.related_id,
                        option_id: random_table?.option_id,
                        suboption_id: random_table?.suboption_id,
                      })
                      .execute();
                    return;
                  }
                  if (field?.calendar) {
                    await tx
                      .insertInto("blueprint_instance_calendars")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: newInstance.id,
                        related_id: field.calendar.related_id,
                        start_day: field.calendar?.start_day,
                        start_month_id: field.calendar?.start_month_id,
                        start_year: field.calendar?.start_year,
                        end_day: field.calendar?.end_day,
                        end_month_id: field.calendar?.end_month_id,
                        end_year: field.calendar?.end_year,
                      })
                      .execute();
                  }
                  if (field?.value) {
                    await tx
                      .insertInto("blueprint_instance_value")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: newInstance.id,
                        value: JSON.stringify(field.value),
                      })
                      .execute();
                  }
                }),
              );
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
            .$if(!!body.relations?.blueprint_fields, (qb) =>
              qb.select([
                (eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("blueprint_fields")
                      .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                      .select([
                        "id",
                        (ebb) =>
                          jsonObjectFrom(
                            ebb
                              .selectFrom("random_tables")
                              .where("random_tables.id", "=", "blueprint_fields.random_table_id")
                              .select(["id", "title"]),
                          ).as("random_table_data"),
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("blueprint_instance_characters")
                              .whereRef("blueprint_instance_characters.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_characters.blueprint_instance_id", "=", "blueprint_instances.id")
                              .select([
                                "related_id",
                                (ebbb) =>
                                  jsonObjectFrom(
                                    ebbb
                                      .selectFrom("characters")
                                      .whereRef("related_id", "=", "characters.id")
                                      .select(["id", "first_name", "last_name", "portrait_id"]),
                                  ).as("character"),
                              ]),
                          ).as("characters"),
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("blueprint_instance_blueprint_instances")
                              .whereRef("blueprint_instance_blueprint_instances.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef(
                                "blueprint_instance_blueprint_instances.blueprint_instance_id",
                                "=",
                                "blueprint_instances.id",
                              )
                              .select([
                                "related_id",
                                (ebbb) =>
                                  jsonObjectFrom(
                                    ebbb
                                      .selectFrom("blueprint_instances")
                                      .whereRef("related_id", "=", "blueprint_instances.id")
                                      .select(["id", "title", "blueprint_instances.parent_id"]),
                                  ).as("blueprint_instance"),
                              ]),
                          ).as("blueprint_instances"),
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("blueprint_instance_documents")
                              .whereRef("blueprint_instance_documents.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_documents.blueprint_instance_id", "=", "blueprint_instances.id")
                              .select([
                                "related_id",
                                (ebbb) =>
                                  jsonObjectFrom(
                                    ebbb
                                      .selectFrom("documents")
                                      .whereRef("related_id", "=", "documents.id")
                                      .select(["id", "title", "icon"]),
                                  ).as("document"),
                              ]),
                          ).as("documents"),
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("blueprint_instance_map_pins")
                              .whereRef("blueprint_instance_map_pins.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_map_pins.blueprint_instance_id", "=", "blueprint_instances.id")

                              .select([
                                "related_id",
                                (ebbb) =>
                                  jsonObjectFrom(
                                    ebbb
                                      .selectFrom("map_pins")
                                      .whereRef("related_id", "=", "map_pins.id")
                                      .select(["id", "title", "icon", "parent_id"]),
                                  ).as("map_pin"),
                              ]),
                          ).as("map_pins"),
                        (ebb) =>
                          jsonObjectFrom(
                            ebb
                              .selectFrom("blueprint_instance_random_tables")
                              .whereRef("blueprint_instance_random_tables.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_random_tables.blueprint_instance_id", "=", "blueprint_instances.id")
                              .select(["related_id", "option_id", "suboption_id"]),
                          ).as("random_table"),
                        (ebb) =>
                          jsonObjectFrom(
                            ebb
                              .selectFrom("blueprint_instance_calendars")
                              .whereRef("blueprint_instance_calendars.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_calendars.blueprint_instance_id", "=", "blueprint_instances.id")
                              .select([
                                "related_id",
                                "start_day",
                                "start_month_id",
                                "start_year",
                                "end_day",
                                "end_month_id",
                                "end_year",
                              ]),
                          ).as("calendar"),
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("blueprint_instance_images")
                              .whereRef("blueprint_instance_images.blueprint_field_id", "=", "blueprint_fields.id")
                              .whereRef("blueprint_instance_images.blueprint_instance_id", "=", "blueprint_instances.id")
                              .select([
                                "related_id",
                                (ebbb) =>
                                  jsonObjectFrom(
                                    ebbb.selectFrom("images").whereRef("related_id", "=", "images.id").select(["id", "title"]),
                                  ).as("image"),
                              ]),
                          ).as("images"),
                        (ebb) =>
                          ebb
                            .selectFrom("blueprint_instance_value")
                            .whereRef("blueprint_instance_value.blueprint_field_id", "=", "blueprint_fields.id")
                            .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
                            .select(["value"])
                            .as("value"),
                      ]),
                  ).as("blueprint_fields"),
              ]),
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
            .select([
              (eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("blueprints")
                    .whereRef("blueprints.id", "=", "blueprint_instances.parent_id")
                    .select(["title", "title_name"]),
                ).as("blueprint"),

              (eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("blueprint_fields")
                    .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                    .select([
                      "id",
                      "field_type",
                      (ebb) =>
                        jsonObjectFrom(
                          ebb
                            .selectFrom("random_tables")
                            .where("random_tables.id", "=", "blueprint_fields.random_table_id")
                            .select(["id", "title"]),
                        ).as("random_table_data"),
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("blueprint_instance_characters")
                            .whereRef("blueprint_instance_characters.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_characters.blueprint_instance_id", "=", params.id)
                            .select([
                              "related_id",
                              (ebbb) =>
                                jsonObjectFrom(
                                  ebbb
                                    .selectFrom("characters")
                                    .whereRef("related_id", "=", "characters.id")
                                    .select(["id", "first_name", "last_name", "portrait_id"]),
                                ).as("character"),
                            ]),
                        ).as("characters"),
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("blueprint_instance_blueprint_instances")
                            .whereRef("blueprint_instance_blueprint_instances.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_blueprint_instances.blueprint_instance_id", "=", params.id)
                            .select([
                              "related_id",
                              (ebbb) =>
                                jsonObjectFrom(
                                  ebbb
                                    .selectFrom("blueprint_instances")
                                    .whereRef("related_id", "=", "blueprint_instances.id")
                                    .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                                    .select([
                                      "blueprint_instances.id",
                                      "blueprint_instances.title",
                                      "blueprints.icon as icon",
                                      "blueprint_instances.parent_id",
                                    ]),
                                ).as("blueprint_instance"),
                            ]),
                        ).as("blueprint_instances"),
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("blueprint_instance_documents")
                            .whereRef("blueprint_instance_documents.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_documents.blueprint_instance_id", "=", params.id)

                            .select([
                              "related_id",
                              (ebbb) =>
                                jsonObjectFrom(
                                  ebbb
                                    .selectFrom("documents")
                                    .whereRef("related_id", "=", "documents.id")
                                    .select(["id", "title", "icon"]),
                                ).as("document"),
                            ]),
                        ).as("documents"),
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("blueprint_instance_map_pins")
                            .whereRef("blueprint_instance_map_pins.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_map_pins.blueprint_instance_id", "=", params.id)
                            .select([
                              "related_id",
                              (ebbb) =>
                                jsonObjectFrom(
                                  ebbb
                                    .selectFrom("map_pins")
                                    .whereRef("related_id", "=", "map_pins.id")
                                    .select(["id", "title", "icon", "parent_id"]),
                                ).as("map_pin"),
                            ]),
                        ).as("map_pins"),
                      (ebb) =>
                        jsonObjectFrom(
                          ebb
                            .selectFrom("blueprint_instance_random_tables")
                            .whereRef("blueprint_instance_random_tables.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_random_tables.blueprint_instance_id", "=", params.id)
                            .select(["related_id", "option_id", "suboption_id"]),
                        ).as("random_table"),
                      (ebb) =>
                        jsonObjectFrom(
                          ebb
                            .selectFrom("blueprint_instance_calendars")
                            .whereRef("blueprint_instance_calendars.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_calendars.blueprint_instance_id", "=", params.id)
                            .select([
                              "related_id",
                              "start_day",
                              "start_month_id",
                              "start_year",
                              "end_day",
                              "end_month_id",
                              "end_year",
                            ]),
                        ).as("calendar"),
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("blueprint_instance_images")
                            .whereRef("blueprint_instance_images.blueprint_field_id", "=", "blueprint_fields.id")
                            .where("blueprint_instance_images.blueprint_instance_id", "=", params.id)
                            .select([
                              "related_id",
                              (ebbb) =>
                                jsonObjectFrom(
                                  ebbb.selectFrom("images").whereRef("related_id", "=", "images.id").select(["id", "title"]),
                                ).as("image"),
                            ]),
                        ).as("images"),
                      (ebb) =>
                        ebb
                          .selectFrom("blueprint_instance_value")
                          .whereRef("blueprint_instance_value.blueprint_field_id", "=", "blueprint_fields.id")
                          .where("blueprint_instance_value.blueprint_instance_id", "=", params.id)
                          .select(["value"])
                          .as("value"),
                    ]),
                ).as("blueprint_fields"),
            ])
            .executeTakeFirstOrThrow();

          // .$if(!!body?.relations?.tags, (qb) =>
          //   qb.select((eb) => TagQuery(eb, "_blueprint_instancesTotags", "blueprint_instances")),
          // )

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
              await Promise.all(
                body.relations.blueprint_fields.flatMap(async (field) => {
                  if (field.value) {
                    return tx
                      .insertInto("blueprint_instance_value")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: params.id,
                        value: JSON.stringify(field.value),
                      })
                      .onConflict((oc) =>
                        oc
                          .columns(["blueprint_field_id", "blueprint_instance_id"])
                          .doUpdateSet({ value: JSON.stringify(field.value) }),
                      )
                      .execute();
                  }
                  if (field.characters) {
                    await tx
                      .deleteFrom("blueprint_instance_characters")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    if (field.characters.length) {
                      return field.characters.map((char) =>
                        tx
                          .insertInto("blueprint_instance_characters")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: char.related_id,
                          })
                          .execute(),
                      );
                    }
                  }
                  if (field.blueprint_instances) {
                    await tx
                      .deleteFrom("blueprint_instance_blueprint_instances")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    if (field.blueprint_instances.length) {
                      return field.blueprint_instances.map((char) =>
                        tx
                          .insertInto("blueprint_instance_blueprint_instances")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: char.related_id,
                          })
                          .execute(),
                      );
                    }
                  }
                  if (field.documents) {
                    if (field.documents.length) {
                      await tx
                        .deleteFrom("blueprint_instance_documents")
                        .where("blueprint_instance_id", "=", params.id)
                        .where("blueprint_field_id", "=", field.id)
                        .execute();
                      return field.documents.map((char) =>
                        tx
                          .insertInto("blueprint_instance_documents")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: char.related_id,
                          })
                          .execute(),
                      );
                    }
                  }
                  if (field.map_pins) {
                    await tx
                      .deleteFrom("blueprint_instance_map_pins")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    if (field.map_pins.length) {
                      return field.map_pins.map((char) =>
                        tx
                          .insertInto("blueprint_instance_map_pins")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: char.related_id,
                          })
                          .execute(),
                      );
                    }
                  }
                  if (field.images) {
                    await tx
                      .deleteFrom("blueprint_instance_images")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    if (field.images.length) {
                      return field.images.map((char) =>
                        tx
                          .insertInto("blueprint_instance_images")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: char.related_id,
                          })
                          .execute(),
                      );
                    }
                  }
                  if (field.random_table) {
                    await tx
                      .deleteFrom("blueprint_instance_random_tables")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    return tx
                      .insertInto("blueprint_instance_random_tables")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: params.id,
                        related_id: field.random_table.related_id,
                        option_id: field.random_table.option_id,
                        suboption_id: field.random_table.suboption_id,
                      })
                      .execute();
                  }
                  if (field.calendar) {
                    await tx
                      .deleteFrom("blueprint_instance_calendars")
                      .where("blueprint_instance_id", "=", params.id)
                      .where("blueprint_field_id", "=", field.id)
                      .execute();
                    return tx
                      .insertInto("blueprint_instance_calendars")
                      .values({
                        blueprint_field_id: field.id,
                        blueprint_instance_id: params.id,
                        related_id: field.calendar.related_id,
                        start_day: field.calendar.start_day,
                        start_month_id: field.calendar.start_month_id,
                        start_year: field.calendar.start_year,
                        end_day: field.calendar.end_day,
                        end_month_id: field.calendar.end_month_id,
                        end_year: field.calendar.end_year,
                      })
                      .execute();
                  }
                }),
              );
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
