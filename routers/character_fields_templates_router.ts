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
          const parsedFields = insertCharacterFieldsSchema.array().parse(req.body.relations.character_fields);
          const newFields = await tx.insertInto("character_fields").values(parsedFields).returning("id").execute();

          await tx
            .insertInto("_character_fieldsTocharacter_fields_templates")
            .values(newFields.map((field) => ({ A: field.id, B: newTemplate.id })))
            .execute();
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
                .selectFrom("_character_fieldsTocharacter_fields_templates")
                .whereRef("character_fields_templates.id", "=", "_character_fieldsTocharacter_fields_templates.B")
                .leftJoin("character_fields", "id", "_character_fieldsTocharacter_fields_templates.A")
                .select([
                  "character_fields.id",
                  "character_fields.title",
                  "character_fields.field_type",
                  "character_fields.options",
                  "character_fields.sort",
                  "character_fields.formula",
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
              .selectFrom("_character_fieldsTocharacter_fields_templates")
              .whereRef("character_fields_templates.id", "=", "_character_fieldsTocharacter_fields_templates.B")
              .leftJoin("character_fields", "character_fields.id", "_character_fieldsTocharacter_fields_templates.A")
              .select([
                "character_fields.id",
                "character_fields.title",
                "character_fields.options",
                "character_fields.field_type",
                "character_fields.sort",
                "character_fields.formula",
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
              .selectFrom("_character_fieldsTocharacter_fields_templates")
              .select(["_character_fieldsTocharacter_fields_templates.A"])
              .where("_character_fieldsTocharacter_fields_templates.B", "=", req.params.id)
              .execute();

            const existingIds = existingCharacterFields.map((field) => field.A);
            const newIds = character_fields.map((field) => field.id);

            const idsToRemove = existingIds.filter((id) => !newIds.includes(id));
            const itemsToAdd = character_fields.filter((field) => !existingIds.includes(field.id));
            const itemsToUpdate = character_fields.filter((field) => existingIds.includes(field.id));

            if (idsToRemove.length) {
              await tx.deleteFrom("character_fields").where("id", "in", idsToRemove).execute();
            }
            if (itemsToAdd.length) {
              const parsedFields = insertCharacterFieldsSchema.array().parse(itemsToAdd.map((field) => omit(field, ["id"])));
              const newFields = await tx.insertInto("character_fields").values(parsedFields).returning("id").execute();

              await tx
                .insertInto("_character_fieldsTocharacter_fields_templates")
                .values(newFields.map((field) => ({ A: field.id, B: req.params.id })))
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
