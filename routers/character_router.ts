import { randomUUID } from "crypto";
import Elysia from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import groupBy from "lodash.groupby";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { InsertCharacterSchema, ListCharacterSchema, ReadCharacterSchema, UpdateCharacterSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, constructTagFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";
import { getCharacterFullName } from "../utils/transform";

export function character_router(app: Elysia) {
  return app.group("/characters", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
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
              if (body.relations?.character_fields?.length) {
                const { character_fields } = body.relations;
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
                  .executeTakeFirst();
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
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
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
              if (body?.relations?.character_fields) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_to_character_fields")
                      .select([
                        "characters_to_character_fields.character_field_id as id",
                        "characters_to_character_fields.value",
                      ])
                      .whereRef("characters_to_character_fields.character_id", "=", "characters.id")
                      .leftJoin("character_fields", "character_fields.id", "character_field_id")
                      .select(["character_fields.parent_id as template_id"]),
                  ).as("character_fields"),
                );
              }
              if (body?.relations?.relationships) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .select(["character_a_id as id"])
                      .where("character_a_id", "=", params.id)
                      .leftJoin("characters", "characters.id", "character_b_id")
                      .select([
                        "character_b_id as id",
                        "characters.first_name",
                        "characters.nickname",
                        "characters.last_name",
                        "characters.portrait_id",
                        "characters_relationships.relation_type_id",
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
                      .select([
                        "character_a_id as id",
                        "characters.first_name",
                        "characters.nickname",
                        "characters.last_name",
                        "characters.portrait_id",
                        "characters_relationships.relation_type_id",
                      ]),
                  ).as("related_from"),
                );

                // qb = qb.select((eb) =>
                //   jsonArrayFrom(
                //     eb
                //       .selectFrom("characters_relationships as cr")
                //       .leftJoin("characters_relationships as cr2", "cr.character_b_id", "cr2.character_b_id")
                //       .where((wb) => wb.and([wb("cr.character_a_id", "=", params.id), wb("cr2.relation_type_id", "=", "parent")]))
                //       .leftJoin("characters", "characters.id", "cr2.character_a_id")
                //       .where("characters.id", "!=", params.id)
                //       .distinctOn("characters.id")
                //       .select([
                //         "characters.id",
                //         "characters.first_name",
                //         "characters.nickname",
                //         "characters.last_name",
                //         "characters.portrait_id",
                //         "cr.relation_type_id",
                //       ]),
                //   ).as("siblings"),
                // );
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

                // qb = qb.select((eb) =>
                //   jsonArrayFrom(
                //     eb
                //       .selectFrom("characters_relationships as cr")
                //       .leftJoin("characters_relationships as cr2", "cr.character_b_id", "cr2.character_b_id")
                //       .where((wb) =>
                //         wb.and([wb("cr.character_a_id", "=", params.id), wb("cr2.relation_type_id", "=", "parent")]),
                //       )
                //       .leftJoin("characters", "characters.id", "cr2.character_a_id")
                //       .where("characters.id", "!=", params.id)
                //       .distinctOn("characters.id")
                //       .select([
                //         "characters.id",
                //         "characters.first_name",
                //         "characters.nickname",
                //         "characters.last_name",
                //         "characters.portrait_id",
                //         "cr.relation_type_id",
                //       ]),
                //   ).as("siblings"),
                // );
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
                      .select(["documents.id", "documents.icon", "documents.title"]),
                  ).as("documents"),
                );
              }

              return qb;
            })
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
        },
      )
      .get(
        "/family/:relation_type_id/:id",
        async ({ params }) => {
          let finalNodes: any[] = [];
          let finalEdges: any[] = [];
          const { id, relation_type_id } = params;

          const relationType = await db
            .selectFrom("character_relationship_types")
            .where("id", "=", relation_type_id)
            .select(["id", "title", "ascendant_title", "descendant_title"])
            .executeTakeFirstOrThrow();

          const isDirect = !relationType.ascendant_title && !relationType.descendant_title;
          const targetArrow = isDirect ? "none" : "triangle";
          const curveStyle = isDirect ? "straight" : "taxi";

          // If it is not a hierarchical relationship
          if (isDirect) {
            // const source = await db
            //   .selectFrom("characters")
            //   .select(["id", "first_name", "nickname", "last_name", "portrait_id", "project_id"])
            //   .where("characters.id", "=", params.id)
            //   .executeTakeFirstOrThrow();
            const targets = await db
              .selectFrom("characters_relationships")
              .where((eb) => eb.and([eb("character_a_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
              .leftJoin("characters", "characters.id", "characters_relationships.character_b_id")
              .select(["id", "first_name", "nickname", "last_name", "portrait_id", "project_id"])
              .union(
                db
                  .selectFrom("characters_relationships")
                  .where((eb) => eb.and([eb("character_b_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
                  .leftJoin("characters", "characters.id", "characters_relationships.character_a_id")
                  .select(["id", "first_name", "nickname", "last_name", "portrait_id", "project_id"]),
              )
              .union(
                db
                  .selectFrom("characters")
                  .where("characters.id", "=", params.id)
                  .select(["id", "first_name", "nickname", "last_name", "portrait_id", "project_id"]),
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

          // Get ids of main branch/parent characters and their generations
          const p = await db
            .withRecursive("character_tree", (db) =>
              db
                .selectFrom("characters_relationships")
                .where((eb) => eb.and([eb("character_a_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
                .select(["character_b_id as parent_id", () => sql<number>`0`.as("generation")])
                .unionAll(
                  db
                    .selectFrom("characters_relationships")
                    .innerJoin("character_tree", "character_a_id", "character_tree.parent_id")
                    .where("relation_type_id", "=", relation_type_id)
                    .select([
                      "characters_relationships.character_b_id as parent_id",
                      () => sql<number>`character_tree.generation + 1`.as("generation"),
                    ])
                    .where("generation", "<", isDirect ? 0 : 5),
                ),
            )
            .selectFrom("character_tree")
            .selectAll()
            .execute();
          const c = await db
            .withRecursive("character_tree", (db) =>
              db
                .selectFrom("characters_relationships")
                .where((eb) => eb.and([eb("character_b_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
                .select(["character_a_id as child_id", () => sql<number>`0`.as("generation")])

                .unionAll(
                  db
                    .selectFrom("characters_relationships")
                    .innerJoin("character_tree", "character_b_id", "character_tree.child_id")
                    .where("relation_type_id", "=", relation_type_id)
                    .select([
                      "characters_relationships.character_a_id as child_id",
                      () => sql<number>`character_tree.generation + 1`.as("generation"),
                    ])
                    .where("generation", "<", isDirect ? 0 : 5),
                ),
            )
            .selectFrom("character_tree")
            .selectAll()
            .execute();
          const parent_ids = p.reverse().map((p) => p.parent_id);
          const child_ids = c
            .reverse()
            .map((c) => c.child_id)
            .filter((c_id) => !parent_ids.includes(c_id));

          if (!parent_ids.length && !child_ids.length) {
            return { data: { nodes: [], edges: [] }, message: MessageEnum.success, ok: true };
          }

          if (parent_ids.length) {
            // Get parents data along with children
            const parents = await db
              .selectFrom("characters as sources")
              .where("id", "in", parent_ids)
              .leftJoin("characters_relationships", "character_b_id", "id")
              .where("relation_type_id", "=", relation_type_id)
              .select([
                "id",
                "first_name",
                "nickname",
                "last_name",
                "portrait_id",
                "project_id",
                (eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .whereRef("character_b_id", "=", "sources.id")
                      .leftJoin("characters as children", "children.id", "characters_relationships.character_a_id")
                      // .leftJoin(
                      //   "character_relationship_types",
                      //   "character_relationship_types.id",
                      //   "characters_relationships.relation_type_id",
                      // )
                      .where("relation_type_id", "=", relation_type_id)
                      .select([
                        "id",
                        "first_name",
                        "nickname",
                        "last_name",
                        "project_id",
                        "portrait_id",
                        "character_b_id as parent_id",
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
                    character_id: parent.id,
                    first_name: parent.first_name,
                    nickname: parent.nickname,
                    last_name: parent.last_name,
                    portrait_id: parent.portrait_id,
                    // relation_type: parent.relation_type,
                    project_id: parent.project_id,
                    generation,
                  };
                }
              })
              .filter((p) => Boolean(p));

            const itemsWithGen = groupBy([...parentsWithGen, ...targetsWithGen], "generation");

            const nodes = Object.entries(itemsWithGen).flatMap(([, members]) => {
              return members
                .map((member) => {
                  if (member)
                    return {
                      id: member.id,
                      character_id: member.id,
                      label: getCharacterFullName(member.first_name as string, member?.nickname, member?.last_name),
                      width: 50,
                      height: 50,
                      image_id: member.portrait_id ?? [],
                      is_locked: false,
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
                      target_arrow_shape: targetArrow,
                      curve_style: curveStyle,
                      taxi_direction: "downward",
                    };
                  });
                }
              });

            finalNodes = finalNodes.concat(nodes);
            finalEdges = finalEdges.concat(edges);
          }
          if (child_ids.length) {
            const children = await db
              .selectFrom("characters as targets")
              .where("id", "in", child_ids)
              .leftJoin("characters_relationships", "character_a_id", "id")
              .where("relation_type_id", "=", relation_type_id)
              .select([
                "id",
                "first_name",
                "nickname",
                "last_name",
                "portrait_id",
                "project_id",
                // "characters_relationships.relation_type",
                (eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("characters_relationships")
                      .whereRef("character_a_id", "=", "targets.id")
                      .leftJoin("characters as parents", "parents.id", "characters_relationships.character_b_id")
                      .where("relation_type_id", "=", relation_type_id)
                      .select([
                        "id",
                        "first_name",
                        "last_name",
                        "project_id",
                        "portrait_id",
                        "character_a_id as child_id",
                        // "characters_relationships.relation_type",
                      ]),
                  ).as("targets"),
              ])
              .distinctOn("id")
              .execute();
            const targetsWithGen = uniqBy(
              children.flatMap((p) => p.targets),
              "id",
            )
              .map((t) => {
                const generation = c.find((child) => child.child_id === t.id || child.child_id === t.child_id)?.generation;
                if (typeof generation === "number") {
                  if (t?.id && child_ids.includes(t.id)) {
                    return { ...t, generation };
                  }
                  return { ...t, generation: generation - 1 };
                }
              })
              .filter((t) => Boolean(t) && !child_ids.includes(t?.id as string));

            const childrenWithGen = children
              .map((child) => {
                const generation = c.find((ch) => ch.child_id === child.id)?.generation;
                if (typeof generation === "number") {
                  return {
                    id: child.id,
                    character_id: child.id,
                    first_name: child.first_name,
                    nickname: child.nickname,
                    last_name: child.last_name,
                    portrait_id: child.portrait_id,
                    // relation_type: child.relation_type,
                    project_id: child.project_id,
                    generation,
                  };
                }
              })
              .filter((p) => Boolean(p));

            const itemsWithGen = groupBy([...childrenWithGen, ...targetsWithGen], "generation");
            const nodes = Object.entries(itemsWithGen).flatMap(([, members]) => {
              return members
                .map((member) => {
                  if (member)
                    return {
                      id: member.id,
                      character_id: member.id,
                      label: `${member.first_name} ${member?.last_name || ""}`,
                      width: 50,
                      height: 50,
                      image_id: member.portrait_id ?? [],
                      is_locked: false,
                    };
                })
                .filter((m) => !!m);
            });

            const edges = children
              .filter((c) => !!c.targets.length)
              .flatMap((par) => {
                if (par.targets.length) {
                  return par.targets.map((target) => {
                    return {
                      id: randomUUID(),
                      source_id: target.id,
                      target_id: target?.child_id,
                      target_arrow_shape: targetArrow,
                      curve_style: curveStyle,
                      taxi_direction: "downward",
                    };
                  });
                }
              });

            finalNodes = finalNodes.concat(nodes);
            finalEdges = finalEdges.concat(edges);
          }
          return { data: { edges: finalEdges, nodes: finalNodes }, ok: true, message: MessageEnum.success };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            let deletedTags: string[] | null = null;

            if (body.data) {
              await tx.updateTable("characters").where("characters.id", "=", params.id).set(body.data).execute();
            }
            if (body.relations?.character_fields) {
              const existingCharacterFields = await tx
                .selectFrom("characters_to_character_fields")
                .select(["characters_to_character_fields.character_field_id as id", "characters_to_character_fields.value"])
                .where("characters_to_character_fields.character_id", "=", params.id)
                .execute();
              const existingIds = existingCharacterFields.map((field) => field.id);
              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds,
                body.relations?.character_fields,
              );

              if (idsToRemove.length) {
                await tx.deleteFrom("characters_to_character_fields").where("character_field_id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("characters_to_character_fields")
                  .values(
                    itemsToAdd.map((item) => ({
                      character_id: params.id,
                      character_field_id: item.id,
                      value: JSON.stringify(item.value),
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    await tx
                      .updateTable("characters_to_character_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", item.id)
                      .set({ value: JSON.stringify(item.value) })
                      .execute();
                  }),
                );
              }
            }
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
                  const templates = await tx
                    .selectFrom("character_fields_templates")
                    .select(["id"])
                    .leftJoin(
                      "_character_fields_templatesTotags",
                      "_character_fields_templatesTotags.A",
                      "character_fields_templates.id",
                    )
                    .where("_character_fields_templatesTotags.B", "in", deletedTags)
                    .execute();

                  const templateIds = templates.map((t) => t.id);
                  if (templateIds?.length) {
                    console.log(templateIds);
                    await tx
                      .deleteFrom("characters_to_character_fields")
                      .using("character_fields")
                      .where("characters_to_character_fields.character_id", "=", params.id)
                      .whereRef("characters_to_character_fields.character_field_id", "=", "character_fields.id")
                      .where("character_fields.parent_id", "in", templateIds)
                      .returningAll()
                      .execute();
                  }
                }
                // if all tags are removed, remove all fields
                else {
                  await tx
                    .deleteFrom("characters_to_character_fields")
                    .where("characters_to_character_fields.character_id", "=", params.id)
                    .execute();
                }
              }
            }
            if (body.relations?.related_to) {
              const existingRelatedTo = await tx
                .selectFrom("characters_relationships")
                .select(["character_a_id as id", "character_b_id", "relation_type_id"])
                .where("character_a_id", "=", params.id)
                .execute();
              const existingIds = existingRelatedTo.map((relation) => relation.id);
              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, body.relations?.related_to);
              if (idsToRemove.length) {
                await tx.deleteFrom("characters_relationships").where("character_a_id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("characters_relationships")
                  .values(
                    itemsToAdd.map((item) => ({
                      character_a_id: params.id,
                      character_b_id: item.id,
                      relation_type_id: item.relation_type_id,
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) =>
                    tx
                      .updateTable("characters_relationships")
                      .where("character_a_id", "=", params.id)
                      .where("character_b_id", "=", item.id)
                      .set({ relation_type_id: item.relation_type_id })
                      .execute(),
                  ),
                );
              }
            }
            if (body.relations?.related_other) {
              const existingRelatedTo = await tx
                .selectFrom("characters_relationships")
                .leftJoin(
                  "character_relationship_types",
                  "character_relationship_types.id",
                  "characters_relationships.relation_type_id",
                )
                .where("character_a_id", "=", params.id)
                .where((wb) =>
                  wb.and([
                    wb("character_relationship_types.ascendant_title", "is", null),
                    wb("character_relationship_types.descendant_title", "is", null),
                  ]),
                )
                .select(["character_a_id as id", "character_b_id", "relation_type_id"])
                .execute();
              const existingIds = existingRelatedTo.map((relation) => relation.id);
              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds,
                body.relations?.related_other,
              );
              if (idsToRemove.length) {
                await tx.deleteFrom("characters_relationships").where("character_a_id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("characters_relationships")
                  .values(
                    itemsToAdd.map((item) => ({
                      character_a_id: params.id,
                      character_b_id: item.id,
                      relation_type_id: item.relation_type_id,
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) =>
                    tx
                      .updateTable("characters_relationships")
                      .where("character_a_id", "=", params.id)
                      .where("character_b_id", "=", item.id)
                      .set({ relation_type_id: item.relation_type_id })
                      .execute(),
                  ),
                );
              }
            }
            if (body.relations?.related_from) {
              const existingRelatedTo = await tx
                .selectFrom("characters_relationships")
                .select(["character_b_id as id", "character_a_id", "relation_type_id"])
                .where("character_b_id", "=", params.id)
                .execute();
              const existingIds = existingRelatedTo.map((relation) => relation.id);
              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingIds,
                body.relations?.related_from,
              );
              if (idsToRemove.length) {
                await tx.deleteFrom("characters_relationships").where("character_b_id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("characters_relationships")
                  .values(
                    itemsToAdd.map((item) => ({
                      character_a_id: item.id,
                      character_b_id: params.id,
                      relation_type_id: item.relation_type_id,
                    })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) =>
                    tx
                      .updateTable("characters_relationships")
                      .where("character_a_id", "=", params.id)
                      .where("character_b_id", "=", item.id)
                      .set({ relation_type_id: item.relation_type_id })
                      .execute(),
                  ),
                );
              }
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
        async ({ params }) => {
          await db.deleteFrom("characters").where("characters.id", "=", params.id).execute();
          return { message: `Character ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
