import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import {
  InsertCharacterFieldsTemplateSchema,
  ListCharacterFieldsTemplateSchema,
  ReadCharacterFieldsTemplateSchema,
  UpdateTemplateSchema,
} from "../database/validation/character_fields_templates";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, constructTagFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function character_fields_templates_router(app: Elysia) {
  return app.group("/character_fields_templates", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const newTemplate = await tx
              .insertInto("character_fields_templates")
              .values(body.data)
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.character_fields) {
              await tx
                .insertInto("character_fields")
                .values(
                  body.relations.character_fields.map((field) => ({
                    ...field,
                    parent_id: newTemplate.id,
                    options: JSON.stringify(field.options || []),
                  })),
                )
                .execute();
            }
            if (body.relations?.tags) {
              await CreateTagRelations({
                tx,
                relationalTable: "_character_fields_templatesTotags",
                id: newTemplate.id,
                tags: body.relations.tags,
              });
            }
          });
          return { message: `Template ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertCharacterFieldsTemplateSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("character_fields_templates")
            .where("character_fields_templates.project_id", "=", body.data.project_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb
                .clearSelect()
                .select(
                  (body.fields || [])?.map((field) => `character_fields_templates.${field}`) as SelectExpression<
                    DB,
                    "character_fields_templates"
                  >[],
                ),
            )
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("character_fields_templates", qb, body.filters);
              return qb;
            })
            .$if(!!body?.relationFilters?.tags?.length, (qb) =>
              constructTagFilter(
                "character_fields_templates",
                qb,
                "_character_fields_templatesTotags",
                body?.relationFilters?.tags || [],
                "A",
                "B",
              ),
            )
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.character_fields) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("character_fields")
                      .whereRef("character_fields_templates.id", "=", "character_fields.parent_id")
                      .select([
                        "character_fields.id",
                        "character_fields.title",
                        "character_fields.field_type",
                        "character_fields.options",
                        "character_fields.sort",
                        "character_fields.formula",
                        "character_fields.random_table_id",
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
                                    sb
                                      .selectFrom("months")
                                      .select(["months.id", "months.title", "months.days"])
                                      .orderBy("months.sort")
                                      .whereRef("months.parent_id", "=", "calendars.id"),
                                  ).as("months"),
                              ])
                              .whereRef("calendars.id", "=", "character_fields.calendar_id"),
                          ).as("calendar"),
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("random_tables")
                              .select([
                                "random_tables.id",
                                "random_tables.title",
                                (ebb) =>
                                  jsonArrayFrom(
                                    ebb
                                      .selectFrom("random_table_options")
                                      .whereRef("random_tables.id", "=", "random_table_options.parent_id")
                                      .select([
                                        "id",
                                        "title",
                                        (ebbb) =>
                                          jsonArrayFrom(
                                            ebbb
                                              .selectFrom("random_table_suboptions")
                                              .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id")
                                              .select(["id", "title"]),
                                          ).as("random_table_suboptions"),
                                      ]),
                                  ).as("random_table_options"),
                              ])
                              .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                          ).as("random_table"),
                      ]),
                  ).as("character_fields"),
                );
              }
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_character_fields_templatesTotags", "character_fields_templates"));
              }
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListCharacterFieldsTemplateSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("character_fields_templates")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields as SelectExpression<DB, "character_fields_templates">[]),
            )
            .where("character_fields_templates.id", "=", params.id)
            .$if(!!body?.relations?.character_fields, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields")
                    .whereRef("character_fields.parent_id", "=", "character_fields_templates.id")
                    .select([
                      "character_fields.id",
                      "character_fields.title",
                      "character_fields.options",
                      "character_fields.field_type",
                      "character_fields.sort",
                      "character_fields.formula",
                      "character_fields.random_table_id",
                      "character_fields.calendar_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select(["id", "title"])
                            .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                        ).as("random_table"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select(["id", "title"])
                            .whereRef("calendars.id", "=", "character_fields.calendar_id"),
                        ).as("calendar"),
                    ])
                    .orderBy("sort"),
                ).as("character_fields"),
              ),
            )
            .$if(!!body?.relations?.tags, (qb) =>
              qb.select((eb) => TagQuery(eb, "_character_fields_templatesTotags", "character_fields_templates")),
            )
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCharacterFieldsTemplateSchema,
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
                  .updateTable("character_fields_templates")
                  .set(body.data)
                  .where("character_fields_templates.id", "=", params.id)
                  .executeTakeFirstOrThrow();
              }
              if (body?.relations?.character_fields) {
                const { character_fields } = body.relations;
                const existingCharacterFields = await tx
                  .selectFrom("character_fields")
                  .select(["id", "parent_id"])
                  .where("character_fields.parent_id", "=", params.id)
                  .execute();

                const existingIds = existingCharacterFields.map((field) => field.id);

                const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, character_fields);

                if (idsToRemove.length) {
                  await tx.deleteFrom("character_fields").where("id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("character_fields")
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
                        .updateTable("character_fields")
                        .where("character_fields.id", "=", item.id as string)
                        .set({ ...omit(item, ["id"]), options: JSON.stringify(item.options || []) })
                        .execute(),
                    ),
                  );
                }
              }
              if (body.relations?.tags) {
                if (body.relations.tags.length)
                  UpdateTagRelations({
                    relationalTable: "_character_fields_templatesTotags",
                    id: params.id,
                    newTags: body.relations.tags,
                    tx,
                  });
                else await tx.deleteFrom("_character_fields_templatesTotags").where("A", "=", params.id).execute();
              }
            });
          }

          return { message: `Template ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateTemplateSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          const data = await db
            .deleteFrom("character_fields_templates")
            .where("id", "=", params.id)
            .returning(["id", "title", "project_id"])
            .executeTakeFirstOrThrow();
          return { data, message: `Character field template ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
