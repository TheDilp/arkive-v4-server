import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import { insertCharacterFieldsSchema, InsertCharacterFieldsType } from "../database/validation/character_fields";
import {
  InsertCharacterFieldsTemplateType,
  UpdateCharacterFieldsTemplateSchema,
  UpdateCharacterFieldsTemplateType,
} from "../database/validation/character_fields_templates";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";

export function character_fields_templates_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: InsertCharacterFieldsTemplateType;
          relations: { character_fields: InsertCharacterFieldsType[] };
        };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        const newTemplate = await tx
          .insertInto("character_fields_templates")
          .values(req.body.data)
          .returning("id")
          .executeTakeFirstOrThrow();

        if (req.body.relations?.character_fields) {
          const parsedFields = insertCharacterFieldsSchema
            .array()
            .parse(req.body.relations.character_fields.map((field) => ({ ...field, parent_id: newTemplate.id })));
          await tx.insertInto("character_fields").values(parsedFields).execute();
        }
      });

      rep.send({ message: "Template and fields successfully created.", ok: true });
    },
  );
  // #endregion create_routes
  // #region read_routes

  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("character_fields_templates")
      .where("character_fields_templates.project_id", "=", req.body.data.project_id)
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) =>
        qb.clearSelect().select(req.body.fields as SelectExpression<DB, "character_fields_templates">[]),
      )
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("character_fields_templates", qb, req.body.filters);
        return qb;
      })
      .$if(!!req?.body?.relations, (qb) => {
        if (req?.body?.relations?.character_fields) {
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
                        .select(["random_table_options.id", "random_table_options.title"])
                        .whereRef("random_table_options.parent_id", "=", "character_fields.random_table_id"),
                    ).as("random_table_options"),
                ]),
            ).as("character_fields"),
          );
        }
        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("character_fields_templates")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) =>
        qb.clearSelect().select(req.body.fields as SelectExpression<DB, "character_fields_templates">[]),
      )
      .where("character_fields_templates.id", "=", req.params.id)

      .$if(!!req.body?.relations?.character_fields, (qb) =>
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
    rep.send({ data, message: "Success.", ok: true });
  });

  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: {
          data: UpdateCharacterFieldsTemplateType;
          relations?: { character_fields?: { id: string; title?: string; field_type?: string; options?: string[] }[] };
        };
      }>,
      rep,
    ) => {
      if (req.body.data) {
        await db.transaction().execute(async (tx) => {
          if (req.body.data) {
            const parsedData = UpdateCharacterFieldsTemplateSchema.parse(req.body.data);
            await tx
              .updateTable("character_fields_templates")
              .set(parsedData)
              .where("character_fields_templates.id", "=", parsedData.id as string)
              .executeTakeFirstOrThrow();
          }
          if (req.body?.relations?.character_fields) {
            const { character_fields } = req.body.relations;
            const existingCharacterFields = await tx
              .selectFrom("character_fields")
              .select(["id", "parent_id"])
              .where("character_fields.parent_id", "=", req.params.id)
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
              const parsedFields = insertCharacterFieldsSchema
                .array()
                .parse(itemsToAdd.map((field) => ({ ...omit(field, ["id"]), parent_id: req.params.id })));
              await tx.insertInto("character_fields").values(parsedFields).execute();
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

      rep.send({ message: "Template successfully updated.", ok: true });
    },
  );
  // #endregion update_routes
  // #region delete_routes
  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep,
    ) => {
      await db.deleteFrom("character_fields_templates").where("character_fields_templates.id", "=", req.params.id).execute();
      rep.send({ message: "Template successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
