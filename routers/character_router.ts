import { randomUUID } from "crypto";
import Elysia from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { InsertCharacterSchema, ListCharacterSchema, ReadCharacterSchema, UpdateCharacterSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { afterHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, constructTagFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateTagRelations,
  GetRelationsForUpdating,
  TagQuery,
  UpdateCharacterRelationships,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getCharacterFullName } from "../utils/transform";

export function character_router(app: Elysia) {
  return app.state("auth", { userId: "" }).group("/characters", (server) =>
    server
      .post(
        "/create",
        async ({ body, request }) => {
          await db.transaction().execute(async (tx) => {
            const character = await tx.insertInto("characters").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations) {
              if (body.relations?.images) {
                const { images } = body.relations;
                await tx
                  .insertInto("_charactersToimages")
                  .values(images.map((img) => ({ A: character.id, B: img.id })))
                  .execute();
              }
              // if (body.relations?.character_fields?.length) {
              //   const { character_fields } = body.relations;
              //   await tx
              //     .insertInto("characters_to_character_fields")
              //     .values(
              //       character_fields.map((field) => ({
              //         character_field_id: field.id,
              //         value: JSON.stringify(field.value),
              //         character_id: character.id,
              //       })),
              //     )
              //     .execute();
              // }
              if (body.relations?.tags?.length) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "_charactersTotags", id: character.id, tags });
              }
              if (body.relations?.documents?.length) {
                const { documents } = body.relations;
                await tx
                  .insertInto("_charactersTodocuments")
                  .values(
                    documents.map((doc) => ({
                      A: character.id,
                      B: doc.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.related_to?.length) {
                await tx
                  .insertInto("characters_relationships")
                  .values(
                    body.relations.related_to.map((item) => ({
                      character_a_id: character.id,
                      character_b_id: item.id,
                      relation_type_id: item.relation_type_id,
                    })),
                  )
                  .execute();
              }
            }
          });
          const token = request.headers.get("authorization");
          if (token)
            afterHandler(
              {
                first_name: body.data.first_name,
                last_name: body.data.last_name,
                project_id: body.data.project_id,
                image_id: body.data.portrait_id,
              },
              "characters",
              token,
              "create",
            );
          return { message: `Character ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertCharacterSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const result = await db
            .selectFrom("characters")
            .where("characters.project_id", "=", body?.data?.project_id)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "characters">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("characters", qb, body.filters);
              return qb;
            })
            .$if(!!body?.relationFilters?.tags?.length, (qb) =>
              constructTagFilter("characters", qb, "_charactersTotags", body?.relationFilters?.tags || [], "A", "B"),
            )
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.portrait) {
                qb = qb.select((eb) =>
                  jsonObjectFrom(
                    eb
                      .selectFrom("images")
                      .whereRef("images.id", "=", "characters.portrait_id")
                      .select(["images.id", "images.title"]),
                  ).as("portrait"),
                );
              }
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_charactersTotags", "characters"));
              }
              return qb;
            })
            .execute();

          //! TODO: Find better solution via SQL for finding items with all tags

          return {
            data: body?.relationFilters?.tags?.length
              ? uniqBy(result, "id").filter((char) => {
                  const charTags: string[] = char?.tags?.map((t: { id: string }) => t.id);
                  return body?.relationFilters?.tags.every((tag_id) => charTags.includes(tag_id));
                })
              : result,
            message: MessageEnum.success,
            ok: true,
          };
        },
        {
          body: ListCharacterSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("characters")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "characters">[]))
            .where("characters.id", "=", params.id)
            .$if(!!body.relations, (qb) => {
              // if (body?.relations?.character_fields) {
              //   qb = qb.select((eb) =>
              //     jsonArrayFrom(
              //       eb
              //         .selectFrom("characters_to_character_fields")
              //         .select([
              //           "characters_to_character_fields.character_field_id as id",
              //           "characters_to_character_fields.value",
              //         ])
              //         .whereRef("characters_to_character_fields.character_id", "=", "characters.id")
              //         .leftJoin("character_fields", "character_fields.id", "character_field_id")
              //         .select(["character_fields.parent_id as template_id"]),
              //     ).as("character_fields"),
              //   );
              // }
              if (body?.relations?.relationships) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .select(["character_a_id as id"])
                      .where("character_a_id", "=", params.id)
                      .leftJoin("characters", "characters.id", "character_b_id")
                      .leftJoin(
                        "character_relationship_types",
                        "character_relationship_types.id",
                        "characters_relationships.relation_type_id",
                      )
                      .where("character_relationship_types.ascendant_title", "is not", null)
                      .select([
                        "character_b_id as id",
                        "characters.first_name",
                        "characters.nickname",
                        "characters.last_name",
                        "characters.portrait_id",
                        "characters_relationships.relation_type_id",
                        "characters_relationships.id as character_relationship_id",
                        "character_relationship_types.ascendant_title as relation_title",
                        "character_relationship_types.title as relation_type_title",
                      ]),
                  ).as("related_to"),
                );
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .select(["character_b_id as id"])
                      .where("character_b_id", "=", params.id)
                      .leftJoin("characters", "characters.id", "character_a_id")
                      .leftJoin(
                        "character_relationship_types",
                        "character_relationship_types.id",
                        "characters_relationships.relation_type_id",
                      )
                      .where("character_relationship_types.ascendant_title", "is not", null)
                      .select([
                        "character_a_id as id",
                        "characters.first_name",
                        "characters.nickname",
                        "characters.last_name",
                        "characters.portrait_id",
                        "characters_relationships.relation_type_id",
                        "characters_relationships.id as character_relationship_id",
                        "character_relationship_types.descendant_title as relation_title",
                        "character_relationship_types.title as relation_type_title",
                      ]),
                  ).as("related_from"),
                );

                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .leftJoin(
                        "character_relationship_types",
                        "character_relationship_types.id",
                        "characters_relationships.relation_type_id",
                      )
                      .where("characters_relationships.character_a_id", "=", params.id)
                      .where("character_relationship_types.ascendant_title", "is", null)
                      .leftJoin("characters", "characters.id", "character_b_id")
                      .select([
                        "character_b_id as id",
                        "characters.first_name",
                        "characters.nickname",
                        "characters.last_name",
                        "characters.portrait_id",
                        "characters_relationships.relation_type_id",
                        "characters_relationships.id as character_relationship_id",
                        "character_relationship_types.ascendant_title as relation_title",
                        "character_relationship_types.title as relation_type_title",
                      ])
                      .union(
                        eb
                          .selectFrom("characters_relationships")
                          .leftJoin(
                            "character_relationship_types",
                            "character_relationship_types.id",
                            "characters_relationships.relation_type_id",
                          )
                          .where("characters_relationships.character_b_id", "=", params.id)
                          .where("character_relationship_types.descendant_title", "is", null)
                          .leftJoin("characters", "characters.id", "character_a_id")
                          .select([
                            "character_a_id as id",
                            "characters.first_name",
                            "characters.nickname",
                            "characters.last_name",
                            "characters.portrait_id",
                            "characters_relationships.relation_type_id",
                            "characters_relationships.id as character_relationship_id",
                            "character_relationship_types.descendant_title as relation_title",
                            "character_relationship_types.title as relation_type_title",
                          ]),
                      ),
                  ).as("related_other"),
                );
              }
              if (body?.relations?.character_relationship_types) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .distinctOn("relation_type_id")
                      .where((wb) => wb.or([wb("character_a_id", "=", params.id), wb("character_b_id", "=", params.id)]))
                      .leftJoin(
                        "character_relationship_types as related_to",
                        "related_to.id",
                        "characters_relationships.relation_type_id",
                      )
                      .leftJoin(
                        "character_relationship_types as related_from",
                        "related_from.id",
                        "characters_relationships.relation_type_id",
                      )
                      .select([
                        "characters_relationships.relation_type_id as id",
                        "related_from.title as related_from_title",
                        "related_to.title as related_to_title",
                        "related_from.ascendant_title as related_from_ascendant_title",
                        "related_to.ascendant_title as related_to_ascendant_title",
                      ]),
                  ).as("character_relationship_types"),
                );
              }
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_charactersTotags", "characters"));
              }
              if (body?.relations?.portrait) {
                qb = qb.select((eb) =>
                  jsonObjectFrom(
                    eb
                      .selectFrom("images")
                      .whereRef("images.id", "=", "characters.portrait_id")
                      .select(["images.id", "images.title"]),
                  ).as("portrait"),
                );
              }
              if (body?.relations?.images) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("_charactersToimages")
                      .where("_charactersToimages.A", "=", params.id)
                      .leftJoin("images", "images.id", "_charactersToimages.B")
                      .select(["images.id", "images.title"]),
                  ).as("images"),
                );
              }
              if (body?.relations?.locations) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("map_pins")
                      .select(["map_pins.id as map_pin_id"])
                      .whereRef("map_pins.character_id", "=", "characters.id")
                      .leftJoin("maps", "maps.id", "map_pins.parent_id")
                      .select(["maps.id", "maps.title", "maps.image_id"]),
                  ).as("locations"),
                );
              }
              if (body?.relations?.documents) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("_charactersTodocuments")
                      .where("_charactersTodocuments.A", "=", params.id)
                      .leftJoin("documents", "_charactersTodocuments.B", "documents.id")
                      .where("documents.is_folder", "is not", true)
                      .where("documents.is_template", "is not", true)
                      .select(["documents.id", "documents.icon", "documents.title", "documents.image_id"]),
                  ).as("documents"),
                );
              }

              return qb;
            })
            .executeTakeFirstOrThrow();
          // If fetching direct relationships return only unique relationships
          if (data?.related_other) {
            data.related_other = uniqBy(data.related_other, "id");
          }
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
        },
      )
      .get(
        "/family/:relation_type_id/:id/:count",
        async ({ params }) => {
          const { id, relation_type_id, count } = params;

          const relationType = await db
            .selectFrom("character_relationship_types")
            .where("character_relationship_types.id", "=", relation_type_id)
            .select([
              "character_relationship_types.id",
              "character_relationship_types.title",
              "character_relationship_types.ascendant_title",
              "character_relationship_types.descendant_title",
            ])
            .executeTakeFirstOrThrow();

          const isDirect = !relationType.ascendant_title && !relationType.descendant_title;
          const targetArrow = isDirect ? "none" : "triangle";
          const curveStyle = isDirect ? "straight" : "taxi";

          // If it is not a hierarchical relationship
          if (isDirect) {
            const targets = await db
              .selectFrom("characters_relationships")
              .where((eb) => eb.and([eb("character_a_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
              .leftJoin("characters", "characters.id", "characters_relationships.character_b_id")
              .select([
                "characters.id",
                "characters.first_name",
                "characters.nickname",
                "characters.last_name",
                "characters.portrait_id",
                "characters.project_id",
              ])
              .union(
                db
                  .selectFrom("characters_relationships")
                  .where((eb) => eb.and([eb("character_b_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
                  .leftJoin("characters", "characters.id", "characters_relationships.character_a_id")
                  .select(["characters.id", "characters.first_name", "nickname", "last_name", "portrait_id", "project_id"]),
              )
              .union(
                db
                  .selectFrom("characters")
                  .where("characters.id", "=", id)
                  .select(["characters.id", "first_name", "nickname", "last_name", "portrait_id", "project_id"]),
              )
              .execute();

            const nodes = targets.map((target) => ({
              id: target.id,
              character_id: target.id,
              label: getCharacterFullName(target.first_name as string, target?.nickname, target?.last_name),
              width: 50,
              height: 50,
              image_id: target.portrait_id ?? [],
              is_locked: false,
            }));

            const edges = targets
              .filter((t) => t.id !== params.id)
              .map((target) => {
                return {
                  id: randomUUID(),
                  source_id: params.id,
                  target_id: target.id,
                  target_arrow_shape: targetArrow,
                  curve_style: curveStyle,
                  taxi_direction: "downward",
                };
              });

            return { data: { edges, nodes }, ok: true, message: MessageEnum.success };
          }

          const baseCharacterRelationships = await sql<{
            character_a_id: string;
            character_b_id: string;
          }>`
          WITH RECURSIVE
          related_characters (character_a_id, character_b_id, depth) AS (
            SELECT
              character_a_id,
              character_b_id,
              1
            FROM
              characters_relationships
            WHERE
             ( character_a_id = ${id}
              OR character_b_id = ${id})
              AND relation_type_id = ${relation_type_id}
            UNION
            SELECT
              cr.character_a_id,
              cr.character_b_id,
              depth + 1
            FROM
              characters_relationships cr
              INNER JOIN related_characters rc ON cr.character_a_id = rc.character_b_id
              OR cr.character_b_id = rc.character_a_id
            WHERE
              cr.relation_type_id = ${relation_type_id} AND
              depth < ${Number(count || 1) - (Number(count) <= 2 ? 0 : 1)}
          )
        SELECT
          *
        FROM
          related_characters;
          `.execute(db);

          const ids = uniq(baseCharacterRelationships.rows.flatMap((r) => [r.character_a_id, r.character_b_id]));

          const mainCharacters = await db
            .selectFrom("characters")
            .select(["id", "portrait_id", "nickname", "first_name", "last_name"])
            .where("id", "in", ids)
            .execute();

          const additionalChars =
            Number(count) <= 2
              ? []
              : await db
                  .selectFrom("characters")
                  .leftJoin("characters_relationships", "character_b_id", "characters.id")
                  .where("character_a_id", "in", ids)
                  .where("characters.id", "not in", ids)
                  .where("relation_type_id", "=", relation_type_id)
                  .select(["characters.id", "portrait_id", "nickname", "first_name", "last_name", "character_a_id"])

                  .execute();
          const additionalCharsChildren = await db
            .selectFrom("characters")
            .leftJoin("characters_relationships", "character_a_id", "characters.id")
            .where("character_b_id", "in", ids)
            .where("characters.id", "not in", ids)
            .where("relation_type_id", "=", relation_type_id)
            .select(["characters.id", "portrait_id", "nickname", "first_name", "last_name", "character_b_id"])

            .execute();

          const withParents = [...mainCharacters, ...additionalChars, ...additionalCharsChildren].map((char) => {
            const parents = baseCharacterRelationships.rows
              .filter((r) => r.character_a_id === char.id)
              .map((p) => p.character_b_id)
              .concat(additionalChars.filter((c) => c.character_a_id === char.id).map((c) => c.id as string));
            const children = baseCharacterRelationships.rows
              .filter((r) => r.character_b_id === char.id)
              .map((p) => p.character_a_id)
              .concat(additionalCharsChildren.filter((c) => c.character_b_id === char.id).map((c) => c.id as string));
            return { ...char, parents, children };
          });
          const uniqueChars = uniqBy(withParents, "id");

          const nodes = uniqueChars.map((c) => ({
            id: c.id,
            character_id: c.id,
            label: getCharacterFullName(c.first_name as string, c?.nickname, c?.last_name),
            width: 50,
            height: 50,
            image_id: c.portrait_id ?? [],
            is_locked: false,
          }));

          const edges = uniqueChars.flatMap((c) => {
            const base = [];
            if ("parents" in c && c?.parents.length) {
              for (let index = 0; index < c.parents.length; index++) {
                base.push({
                  id: randomUUID(),
                  source_id: c.parents[index],
                  target_id: c.id,
                  target_arrow_shape: targetArrow,
                  curve_style: curveStyle,
                  taxi_direction: "downward",
                });
              }
            }

            if ("children" in c && c?.children.length) {
              for (let index = 0; index < c.children.length; index++) {
                base.push({
                  id: randomUUID(),
                  source_id: c.id,
                  target_id: c.children[index],
                  target_arrow_shape: targetArrow,
                  curve_style: curveStyle,
                  taxi_direction: "downward",
                });
              }
            }
            return base;
          });

          // Get ids of main branch/parent characters and their generations

          return { data: { nodes, edges }, ok: true, message: MessageEnum.success };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, request }) => {
          await db.transaction().execute(async (tx) => {
            let deletedTags: string[] | null = null;

            // if (body.relations?.character_fields) {
            //   const existingCharacterFields = await tx
            //     .selectFrom("characters_to_character_fields")
            //     .select(["characters_to_character_fields.character_field_id as id", "characters_to_character_fields.value"])
            //     .where("characters_to_character_fields.character_id", "=", params.id)
            //     .execute();
            //   const existingIds = existingCharacterFields.map((field) => field.id);
            //   const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
            //     existingIds,
            //     body.relations?.character_fields,
            //   );

            //   if (idsToRemove.length) {
            //     await tx.deleteFrom("characters_to_character_fields").where("character_field_id", "in", idsToRemove).execute();
            //   }
            //   if (itemsToAdd.length) {
            //     await tx
            //       .insertInto("characters_to_character_fields")
            //       .values(
            //         itemsToAdd.map((item) => ({
            //           character_id: params.id,
            //           character_field_id: item.id,
            //           value: JSON.stringify(item.value),
            //         })),
            //       )
            //       .execute();
            //   }
            //   if (itemsToUpdate.length) {
            //     await Promise.all(
            //       itemsToUpdate.map(async (item) => {
            //         await tx
            //           .updateTable("characters_to_character_fields")
            //           .where("character_id", "=", params.id)
            //           .where("character_field_id", "=", item.id)
            //           .set({ value: JSON.stringify(item.value) })
            //           .execute();
            //       }),
            //     );
            //   }
            // }
            if (body.relations?.tags) {
              if (body.relations.tags.length) {
                const tagsToDelete = await UpdateTagRelations({
                  relationalTable: "_charactersTotags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                });
                if (tagsToDelete.length) {
                  deletedTags = tagsToDelete;
                }
              } else {
                await tx.deleteFrom("_charactersTotags").where("A", "=", params.id).execute();
                deletedTags = [];
              }

              if (deletedTags !== null) {
                if (deletedTags?.length) {
                  // const templates = await tx
                  //   .selectFrom("character_fields_templates")
                  //   .select(["id"])
                  //   .leftJoin(
                  //     "_character_fields_templatesTotags",
                  //     "_character_fields_templatesTotags.A",
                  //     "character_fields_templates.id",
                  //   )
                  //   .where("_character_fields_templatesTotags.B", "in", deletedTags)
                  //   .execute();
                  // const templateIds = templates.map((t) => t.id);
                  // if (templateIds?.length) {
                  //   await tx
                  //     .deleteFrom("characters_to_character_fields")
                  //     .using("character_fields")
                  //     .where("characters_to_character_fields.character_id", "=", params.id)
                  //     .whereRef("characters_to_character_fields.character_field_id", "=", "character_fields.id")
                  //     .where("character_fields.parent_id", "in", templateIds)
                  //     .returningAll()
                  //     .execute();
                  // }
                }
                // if all tags are removed, remove all fields
                // else {
                //   await tx
                //     .deleteFrom("characters_to_character_fields")
                //     .where("characters_to_character_fields.character_id", "=", params.id)
                //     .execute();
                // }
              }
            }

            if (body.relations?.related_to) {
              UpdateCharacterRelationships({
                tx,
                id: params.id,
                related: body.relations?.related_to,
                relation_direction: "related_to",
              });
            }
            if (body.relations?.related_other) {
              UpdateCharacterRelationships({
                tx,
                id: params.id,
                related: body.relations?.related_other,
                relation_direction: "related_other",
              });
            }
            if (body.relations?.related_from) {
              UpdateCharacterRelationships({
                tx,
                id: params.id,
                related: body.relations?.related_from,
                relation_direction: "related_from",
              });
            }
            if (body.relations?.documents) {
              const existingDocuments = await tx
                .selectFrom("_charactersTodocuments")
                .select(["_charactersTodocuments.B"])
                .where("_charactersTodocuments.A", "=", params.id)
                .execute();
              const existingIds = existingDocuments.map((field) => field.B);
              const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, body.relations?.documents);
              if (idsToRemove.length) {
                await tx.deleteFrom("_charactersTodocuments").where("_charactersTodocuments.B", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("_charactersTodocuments")
                  .values(
                    itemsToAdd.map((item) => ({
                      A: params.id,
                      B: item.id,
                    })),
                  )
                  .execute();
              }
            }
            if (body.data) {
              const updatedChar = await tx
                .updateTable("characters")
                .where("characters.id", "=", params.id)
                .set(body.data)
                .returning(["first_name", "last_name", "project_id", "portrait_id as image_id"])
                .executeTakeFirstOrThrow();
              const token = request.headers.get("authorization");
              if (token) afterHandler(updatedChar, "characters", token, "update");
            }
          });
          return { message: `Character ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateCharacterSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/add/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body?.relations?.documents) {
              const existingDocumentIds = (
                await tx.selectFrom("_charactersTodocuments").select(["B"]).where("A", "=", params.id).execute()
              ).map((item) => item.B);
              const filteredRequestIds = body.relations.documents
                .map((doc) => doc.id)
                .filter((id) => !existingDocumentIds.includes(id));

              if (filteredRequestIds.length) {
                await tx
                  .insertInto("_charactersTodocuments")
                  .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                  .execute();
              }
            }
            if (body?.relations?.images) {
              const existingImageIds = (
                await tx.selectFrom("_charactersToimages").select(["B"]).where("A", "=", params.id).execute()
              ).map((item) => item.B);
              const filteredRequestIds = body.relations.images
                .map((image) => image.id)
                .filter((id) => !existingImageIds.includes(id));

              if (filteredRequestIds.length) {
                await tx
                  .insertInto("_charactersToimages")
                  .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                  .execute();
              }
            }
            if (body?.relations?.tags) {
              const existingTagIds = (
                await tx.selectFrom("_charactersTotags").select(["B"]).where("A", "=", params.id).execute()
              ).map((item) => item.B);
              const filteredRequestIds = body.relations.tags.map((tag) => tag.id).filter((id) => !existingTagIds.includes(id));
              if (filteredRequestIds.length) {
                await tx
                  .insertInto("_charactersTotags")
                  .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                  .execute();
              }
            }
          });
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: UpdateCharacterSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params, request }) => {
          const data = await db
            .deleteFrom("characters")
            .where("characters.id", "=", params.id)
            .returning(["first_name", "last_name", "project_id", "portrait_id as image_id"])
            .executeTakeFirstOrThrow();
          const token = request.headers.get("authorization");
          if (token) afterHandler(data, "characters", token, "create");

          return { message: `Character ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
