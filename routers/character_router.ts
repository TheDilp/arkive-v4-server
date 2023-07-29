import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import groupBy from "lodash.groupby";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { InsertCharacterSchema, InsertCharacterType, UpdateCharacterSchema, UpdateCharacterType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrderBy } from "../utils/orderByConstructor";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery } from "../utils/relationalQueryHelpers";
import { getGenerationOffset } from "../utils/transform";

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
            related_to?: { id: string; relation_type: string }[];
            related_from?: { id: string; relation_type: string }[];
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
          if (req.body.relations?.tags?.length) {
            const { tags } = req.body.relations;
            await CreateTagRelations({ tx, relationalTable: "_charactersTotags", id: character.id, tags });
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
          if (req.body.relations?.related_to?.length) {
            await tx
              .insertInto("characters_relationships")
              .values(
                req.body.relations.related_to.map((item) => ({
                  character_a_id: character.id,
                  character_b_id: item.id,
                  relation_type: item.relation_type,
                })),
              )
              .execute();
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
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_charactersTotags", "characters"));
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
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success", ok: true });
  });
  server.get("/family/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
    // Get ids of main branch/parent characters and their generations
    const p = await db
      .withRecursive("character_tree", (db) =>
        db
          .selectFrom("characters_relationships")
          .where((eb) =>
            eb.and([
              eb("character_a_id", "=", req.params.id),
              eb.or([eb("relation_type", "=", "father"), eb("relation_type", "=", "mother")]),
            ]),
          )
          .select(["character_b_id as parent_id", () => sql<number>`0`.as("generation")])

          .unionAll(
            db
              .selectFrom("characters_relationships")
              .innerJoin("character_tree", "character_a_id", "character_tree.parent_id")
              .where((eb) => eb.or([eb("relation_type", "=", "father"), eb("relation_type", "=", "mother")]))
              .select([
                "characters_relationships.character_b_id as parent_id",
                () => sql<number>`character_tree.generation + 1`.as("generation"),
              ])
              .where("generation", "<=", 5),
          ),
      )
      .selectFrom("character_tree")
      .selectAll()
      .execute();
    const parent_ids = p.reverse().map((p) => p.parent_id);

    if (!parent_ids.length) {
      rep.send({ data: { nodes: [], edges: [] }, message: "Success", ok: true });
      return;
    }

    // Get parents data along with children
    const parents = await db
      .selectFrom("characters as sources")
      .where("id", "in", parent_ids)
      .leftJoin("characters_relationships", "character_b_id", "id")
      .select([
        "id",
        "first_name",
        "last_name",
        "portrait_id",
        "project_id",
        "characters_relationships.relation_type",
        (eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .whereRef("character_b_id", "=", "sources.id")
              .leftJoin("characters as children", "children.id", "characters_relationships.character_a_id")
              .select([
                "id",
                "first_name",
                "last_name",
                "project_id",
                "portrait_id",
                "character_b_id as parent_id",
                "characters_relationships.relation_type",
              ]),
          ).as("targets"),
      ])
      .distinctOn("id")
      .execute();

    const targetsWithGen = uniqBy(
      parents.flatMap((p) => p.targets),
      "id",
    )
      .map((t) => {
        const generation = p.find((par) => par.parent_id === t.id || par.parent_id === t.parent_id)?.generation;
        if (typeof generation === "number") {
          if (t?.id && parent_ids.includes(t.id)) {
            return { ...t, generation };
          }
          return { ...t, generation: generation - 1 };
        }
      })
      .filter((t) => Boolean(t) && !parent_ids.includes(t?.id as string));

    const parentsWithGen = parents
      .map((parent) => {
        const generation = p.find((par) => par.parent_id === parent.id)?.generation;
        if (typeof generation === "number") {
          return {
            id: parent.id,
            first_name: parent.first_name,
            last_name: parent.last_name,
            portrait_id: parent.portrait_id,
            relation_type: parent.relation_type,
            project_id: parent.project_id,
            generation,
          };
        }
      })
      .filter((p) => Boolean(p));

    const itemsWithGen = groupBy([...parentsWithGen, ...targetsWithGen], "generation");

    const nodes = Object.entries(itemsWithGen).flatMap(([generation, members]) => {
      const parsedGen = parseInt(generation, 10);
      const generationCount = members.length;

      return members
        .map((member, index) => {
          if (member)
            return {
              id: member.id,
              label: `${member.first_name} ${member?.last_name || ""}`,
              x:
                parsedGen * 150 +
                index * (member?.relation_type === "father" ? -300 : 150) +
                (generationCount >= 3 ? getGenerationOffset(index, generationCount) : 0),
              y: parsedGen * -150,
              width: 50,
              height: 50,
              image_id: member.portrait_id ?? [],
            };
        })
        .filter((m) => !!m);
    });

    const edges = parents
      .filter((p) => !!p.targets.length)
      .flatMap((par) => {
        if (par.targets.length) {
          return par.targets.map((target) => {
            return {
              id: randomUUID(),
              source_id: target?.parent_id,
              target_id: target.id,
              target_arrow: "triangle",
              curve_style: "taxi",
              taxi_direction: "downward",
            };
          });
        }
      });

    rep.send({
      data: { nodes: nodes || [], edges: edges || [] },
      message: "Success",
      ok: true,
    });
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
            tags?: { id: string }[];
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
        if (req.body.relations?.related_to) {
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
        if (req.body.relations?.related_from) {
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
        if (req.body.relations?.tags?.length) {
          const existingTags = await tx
            .selectFrom("_charactersTotags")
            .select("B as id")
            .where("A", "=", req.params.id)
            .execute();

          const existingIds = existingTags.map((tag) => tag.id);

          const { tags } = req.body.relations;
          const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, tags);
          if (idsToRemove.length) {
            await tx.deleteFrom("_charactersTotags").where("A", "=", req.params.id).where("B", "in", idsToRemove).execute();
          }

          if (itemsToAdd.length) {
            await tx
              .insertInto("_charactersTotags")
              .values(
                itemsToAdd.map((item) => ({
                  A: req.params.id,
                  B: item.id,
                })),
              )
              .execute();
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
