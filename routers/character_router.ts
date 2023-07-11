import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertCharacterSchema, InsertCharacterType, UpdateCharacterSchema, UpdateCharacterType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrderBy } from "../utils/orderByConstructor";
import { TagQuery } from "../utils/relationalQueryHelpers";

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
          if (req.body.relations?.character_fields) {
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
          if (req.body.relations?.tags) {
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
          if (req.body.relations?.documents) {
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
                .select(["characters_to_character_fields.character_field_id", "characters_to_character_fields.value"])
                .whereRef("characters_to_character_fields.character_id", "=", "characters.id"),
            ).as("character_fields"),
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
        Body: { data: UpdateCharacterType };
      }>,
      rep,
    ) => {
      const parsedData = UpdateCharacterSchema.parse(req.body.data);
      await db.updateTable("characters").where("characters.id", "=", req.params.id).set(parsedData).execute();
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
