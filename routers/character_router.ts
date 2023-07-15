import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertCharacterSchema, InsertCharacterType, UpdateCharacterSchema, UpdateCharacterType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrderBy } from "../utils/orderByConstructor";
import { GetRelationsForUpdating, TagQuery } from "../utils/relationalQueryHelpers";

export function character_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: InsertCharacterType;
          relations?: {
            character_fields?: { id: string; value: string }[];
            tags?: { id: string }[];
            documents?: { id: string }[];
            images?: { id: string }[];
          };
        };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        const parsedData = InsertCharacterSchema.parse(req.body.data);
        const character = await tx.insertInto("characters").values(parsedData).returning("id").executeTakeFirstOrThrow();

        if (req.body?.relations) {
          if (req.body.relations?.images) {
            const { images } = req.body.relations;
            await tx
              .insertInto("_characters_to_images")
              .values(images.map((img) => ({ A: character.id, B: img.id })))
              .execute();
          }
          if (req.body.relations?.character_fields?.length) {
            const { character_fields } = req.body.relations;
            await tx
              .insertInto("characters_to_character_fields")
              .values(
                character_fields.map((field) => ({
                  character_field_id: field.id,
                  value: JSON.stringify(field.value),
                  character_id: character.id,
                })),
              )
              .executeTakeFirst();
          }

          // .leftJoin("characters", "characters.id", "character_b_id")
          // .select(["first_name", "nickname", "last_name"])
          if (req.body.relations?.tags?.length) {
            const { tags } = req.body.relations;
            await tx
              .insertInto("_charactersTotags")
              .values(
                tags.map((tag) => ({
                  A: character.id,
                  B: tag.id,
                })),
              )
              .executeTakeFirst();
          }
          if (req.body.relations?.documents?.length) {
            const { documents } = req.body.relations;
            await tx
              .insertInto("_charactersTodocuments")
              .values(
                documents.map((doc) => ({
                  A: character.id,
                  B: doc.id,
                })),
              )
              .executeTakeFirst();
          }
        }
      });
      rep.send({ message: "Character successfully created.", ok: true });
    },
  );
  // #endregion create_routes

  // #region read_routes

  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("characters")
      .where("characters.project_id", "=", req.body?.data?.project_id)
      .limit(req.body?.pagination?.limit || 10)
      .offset((req.body?.pagination?.page ?? 0) * (req.body?.pagination?.limit || 10))
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "characters">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("characters", qb, req.body.filters);
        return qb;
      })
      .$if(!!req.body.orderBy, (qb) => constructOrderBy(qb, req.body.orderBy?.field as string, req.body.orderBy?.sort))
      .$if(!!req?.body?.relations, (qb) => {
        if (req?.body?.relations?.portrait) {
          qb = qb.select((eb) =>
            jsonObjectFrom(
              eb
                .selectFrom("images")
                .whereRef("images.id", "=", "characters.portrait_id")
                .select(["images.id", "images.title"]),
            ).as("portrait"),
          );
        }
        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("characters")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "characters">[]))
      .where("characters.id", "=", req.params.id)
      .$if(!!req.body.relations, (qb) => {
        if (req.body?.relations?.character_fields) {
          qb = qb.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("characters_to_character_fields")
                .select(["characters_to_character_fields.character_field_id as id", "characters_to_character_fields.value"])
                .whereRef("characters_to_character_fields.character_id", "=", "characters.id")
                .leftJoin(
                  "_character_fieldsTocharacter_fields_templates",
                  "_character_fieldsTocharacter_fields_templates.A",
                  "character_field_id",
                )
                .select(["_character_fieldsTocharacter_fields_templates.B as template_id"]),
            ).as("character_fields"),
          );
        }
        if (req.body?.relations?.relationships) {
          qb = qb.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("characters_relationships")
                .select(["character_a_id as id"])
                .where("character_a_id", "=", req.params.id)
                .leftJoin("characters", "characters.id", "character_b_id")
                .select([
                  "character_b_id as id",
                  "characters.first_name",
                  "characters.nickname",
                  "characters.last_name",
                  "characters.portrait_id",
                  "characters_relationships.relation_type",
                ]),
            ).as("related_to"),
          );
          qb = qb.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("characters_relationships")
                .select(["character_b_id as id"])
                .where("character_b_id", "=", req.params.id)
                .leftJoin("characters", "characters.id", "character_a_id")
                .select([
                  "character_a_id as id",
                  "characters.first_name",
                  "characters.nickname",
                  "characters.last_name",
                  "characters.portrait_id",
                  "characters_relationships.relation_type",
                ]),
            ).as("related_from"),
          );
        }
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_charactersTotags", "characters"));
        }
        return qb;
      })
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: {
          data?: UpdateCharacterType;
          relations?: {
            character_fields?: { id: string; value: string }[];
            related_to?: { id: string; relation_type: string }[];
            related_from?: { id: string; relation_type: string }[];
          };
        };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const parsedData = UpdateCharacterSchema.parse(req.body.data);
          await tx.updateTable("characters").where("characters.id", "=", req.params.id).set(parsedData).execute();
        }
        if (req.body.relations?.character_fields) {
          const existingCharacterFields = await tx
            .selectFrom("characters_to_character_fields")
            .select(["characters_to_character_fields.character_field_id as id", "characters_to_character_fields.value"])
            .where("characters_to_character_fields.character_id", "=", req.params.id)
            .execute();

          const existingIds = existingCharacterFields.map((field) => field.id);
          const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
            existingIds,
            req.body.relations?.character_fields,
          );

          if (idsToRemove.length) {
            await tx.deleteFrom("characters_to_character_fields").where("character_field_id", "in", idsToRemove).execute();
          }
          if (itemsToAdd.length) {
            await tx
              .insertInto("characters_to_character_fields")
              .values(
                itemsToAdd.map((item) => ({
                  character_id: req.params.id,
                  character_field_id: item.id,
                  value: JSON.stringify(item.value),
                })),
              )
              .execute();
          }
          if (itemsToUpdate.length) {
            await Promise.all(
              itemsToUpdate.map(async (item) =>
                tx
                  .updateTable("characters_to_character_fields")
                  .where("character_id", "=", req.params.id)
                  .where("character_field_id", "=", item.id)
                  .set({ value: JSON.stringify(item.value) })
                  .execute(),
              ),
            );
          }
        }
        if (req.body.relations?.related_to?.length) {
          const existingRelatedTo = await tx
            .selectFrom("characters_relationships")
            .select(["character_a_id as id", "character_b_id", "relation_type"])
            .where("character_a_id", "=", req.params.id)
            .execute();

          const existingIds = existingRelatedTo.map((relation) => relation.id);

          const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, req.body.relations?.related_to);
          if (idsToRemove.length) {
            await tx.deleteFrom("characters_relationships").where("character_a_id", "in", idsToRemove).execute();
          }
          if (itemsToAdd.length) {
            await tx
              .insertInto("characters_relationships")
              .values(
                itemsToAdd.map((item) => ({
                  character_a_id: req.params.id,
                  character_b_id: item.id,
                  relation_type: item.relation_type,
                })),
              )
              .execute();
          }
          if (itemsToUpdate.length) {
            await Promise.all(
              itemsToUpdate.map(async (item) =>
                tx
                  .updateTable("characters_relationships")
                  .where("character_a_id", "=", req.params.id)
                  .where("character_b_id", "=", item.id)
                  .set({ relation_type: item.relation_type })
                  .execute(),
              ),
            );
          }
        }
        if (req.body.relations?.related_from?.length) {
          const existingRelatedTo = await tx
            .selectFrom("characters_relationships")
            .select(["character_b_id as id", "character_a_id", "relation_type"])
            .where("character_b_id", "=", req.params.id)
            .execute();

          const existingIds = existingRelatedTo.map((relation) => relation.id);

          const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
            existingIds,
            req.body.relations?.related_from,
          );
          if (idsToRemove.length) {
            await tx.deleteFrom("characters_relationships").where("character_b_id", "in", idsToRemove).execute();
          }
          if (itemsToAdd.length) {
            await tx
              .insertInto("characters_relationships")
              .values(
                itemsToAdd.map((item) => ({
                  character_a_id: req.params.id,
                  character_b_id: item.id,
                  relation_type: item.relation_type,
                })),
              )
              .execute();
          }
          if (itemsToUpdate.length) {
            await Promise.all(
              itemsToUpdate.map(async (item) =>
                tx
                  .updateTable("characters_relationships")
                  .where("character_a_id", "=", req.params.id)
                  .where("character_b_id", "=", item.id)
                  .set({ relation_type: item.relation_type })
                  .execute(),
              ),
            );
          }
        }
      });
      rep.send({ message: "Character successfully updated.", ok: true });
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
      await db.deleteFrom("characters").where("characters.id", "=", req.params.id).execute();
      rep.send({ message: "Character successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
