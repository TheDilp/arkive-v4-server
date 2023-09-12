import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import {
  InsertCharacterFieldsTemplateSchema,
  ListCharacterFieldsTemplateSchema,
  ReadCharacterFieldsTemplateSchema,
  UpdateCharacterFieldsTemplateSchema,
} from "../database/validation/character_fields_templates";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";

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
                .values(body.relations.character_fields.map((field) => ({ ...field, parent_id: newTemplate.id })))
                .execute();
            }
          });
          return { message: `Character template ${MessageEnum.successfully_created}`, ok: true };
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
              qb.clearSelect().select(body.fields as SelectExpression<DB, "character_fields_templates">[]),
            )
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("character_fields_templates", qb, body.filters);
              return qb;
            })
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
                          jsonArrayFrom(
                            eb
                              .selectFrom("random_tables")
                              .select(["random_tables.id", "random_tables.title"])
                              .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
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
                              .whereRef("random_table_options.parent_id", "=", "character_fields.random_table_id"),
                          ).as("random_table_options"),
                      ]),
                  ).as("character_fields"),
                );
              }
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListCharacterFieldsTemplateSchema,
          response: ResponseSchema,
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
                      (eb) =>
                        jsonArrayFrom(
                          eb
                            .selectFrom("random_tables")
                            .select(["id", "title"])
                            .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                        ).as("random_table"),
                    ]),
                ).as("character_fields"),
              ),
            )
            .executeTakeFirstOrThrow();
          return { data, message: "Success.", ok: true };
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
                const newIds = character_fields.map((field) => field.id);

                const idsToRemove = existingIds.filter((id) => !newIds.includes(id));
                const itemsToAdd = character_fields.filter((field) => !existingIds.includes(field.id));
                const itemsToUpdate = character_fields.filter((field) => existingIds.includes(field.id));

                if (idsToRemove.length) {
                  await tx.deleteFrom("character_fields").where("id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("character_fields")
                    .values(itemsToAdd.map((field) => ({ ...omit(field, ["id"]), parent_id: params.id })))
                    .execute();
                }
                if (itemsToUpdate.length) {
                  await Promise.all(
                    itemsToUpdate.map(async (item) =>
                      tx
                        .updateTable("character_fields")
                        .where("character_fields.id", "=", item.id)
                        .set(omit(item, ["id"]))
                        .execute(),
                    ),
                  );
                }
              }
            });
          }

          return { message: `Template ${MessageEnum.successfully_updated}.`, ok: true };
        },
        {
          body: UpdateCharacterFieldsTemplateSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("character_fields_templates").where("character_fields_templates.id", "=", params.id).execute();
        return { message: `Template ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
