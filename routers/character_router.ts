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
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { characterRelationFilter, characterValueFilter, constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateTagRelations,
  GetRelationsForUpdating,
  TagQuery,
  UpdateCharacterRelationships,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getCharacterFullName, groupFiltersByField } from "../utils/transform";

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
                await Promise.all(
                  body.relations.character_fields.map(async (field) => {
                    if (field?.value) {
                      await tx
                        .insertInto("character_value_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: character.id,
                          value: JSON.stringify(field.value),
                        })
                        .execute();
                    }
                    if (field?.documents?.length) {
                      const { documents } = field;
                      await tx
                        .insertInto("character_documents_fields")
                        .values(
                          documents.map((doc) => ({
                            character_field_id: field.id,
                            character_id: character.id,
                            related_id: doc.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.map_pins?.length) {
                      const { map_pins } = field;
                      await tx
                        .insertInto("character_locations_fields")
                        .values(
                          map_pins.map((map_pin) => ({
                            character_field_id: field.id,
                            character_id: character.id,
                            related_id: map_pin.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.images?.length) {
                      const { images } = field;
                      await tx
                        .insertInto("character_images_fields")
                        .values(
                          images.map((image) => ({
                            character_field_id: field.id,
                            character_id: character.id,
                            related_id: image.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.events?.length) {
                      const { events } = field;
                      await tx
                        .insertInto("character_events_fields")
                        .values(
                          events.map((image) => ({
                            character_field_id: field.id,
                            character_id: character.id,
                            related_id: image.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.blueprint_instances?.length) {
                      const { blueprint_instances } = field;
                      await tx
                        .insertInto("character_blueprint_instance_fields")
                        .values(
                          blueprint_instances.map((instance) => ({
                            character_field_id: field.id,
                            character_id: character.id,
                            related_id: instance.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                  }),
                );
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
          const result = db
            .selectFrom("characters")
            .select(body.fields.map((field) => `characters.${field}`) as SelectExpression<DB, "characters">[])
            .distinctOn(
              body.orderBy?.length ? (["characters.id", ...body.orderBy.map((order) => order.field)] as any) : "characters.id",
            )
            .where("characters.project_id", "=", body?.data?.project_id)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("characters", qb, body.filters);
              return qb;
            })
            .$if(!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length, (qb) => {
              const { blueprint_instances, documents, map_pins, events, tags, value } = groupFiltersByField(
                body.relationFilters || {},
              );

              if (tags?.filters?.length) qb = tagsRelationFilter("characters", "_charactersTotags", qb, tags?.filters || []);

              if (documents?.filters?.length)
                qb = characterRelationFilter("character_documents_fields", qb, documents?.filters || []);
              if (map_pins?.filters?.length)
                qb = characterRelationFilter("character_locations_fields", qb, map_pins?.filters || []);
              if (blueprint_instances?.filters?.length)
                qb = characterRelationFilter("character_blueprint_instance_fields", qb, blueprint_instances?.filters || []);
              if (events?.filters?.length) qb = characterRelationFilter("character_events_fields", qb, events?.filters || []);
              if (value?.filters?.length) qb = characterValueFilter(qb, value.filters);

              return qb;
            })
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
            });
          const data = await result.execute();

          return {
            data,
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
                qb = qb.select([
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_documents_fields")
                        .where("character_documents_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          (ebb) =>
                            jsonArrayFrom(
                              ebb
                                .selectFrom("documents")
                                .whereRef("documents.id", "=", "character_documents_fields.related_id")
                                .select(["id", "title", "icon"]),
                            ).as("documents"),
                        ]),
                    ).as("field_documents"),
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_images_fields")
                        .where("character_images_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          (ebb) =>
                            jsonArrayFrom(
                              ebb
                                .selectFrom("images")
                                .whereRef("images.id", "=", "character_images_fields.related_id")
                                .select(["id", "title"]),
                            ).as("images"),
                        ]),
                    ).as("field_images"),
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_events_fields")
                        .where("character_events_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          (ebb) =>
                            jsonArrayFrom(
                              ebb
                                .selectFrom("events")
                                .whereRef("events.id", "=", "character_events_fields.related_id")
                                .select(["id", "title", "parent_id"]),
                            ).as("events"),
                        ]),
                    ).as("field_events"),
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_locations_fields")
                        .where("character_locations_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          (ebb) =>
                            jsonArrayFrom(
                              ebb
                                .selectFrom("map_pins")
                                .whereRef("map_pins.id", "=", "character_locations_fields.related_id")
                                .select(["id", "title", "icon", "parent_id"]),
                            ).as("map_pins"),
                        ]),
                    ).as("field_locations"),
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_blueprint_instance_fields")
                        .where("character_blueprint_instance_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          (ebb) =>
                            jsonArrayFrom(
                              ebb
                                .selectFrom("blueprint_instances")
                                .whereRef("blueprint_instances.id", "=", "character_blueprint_instance_fields.related_id")
                                .select(["id", "title", "parent_id"]),
                            ).as("blueprint_instances"),
                        ]),
                    ).as("field_blueprint_instances"),
                  (ebb) =>
                    jsonArrayFrom(
                      ebb
                        .selectFrom("character_random_table_fields")
                        .where("character_random_table_fields.character_id", "=", params.id)
                        .select(["character_field_id as id", "related_id", "option_id", "suboption_id"]),
                    ).as("field_random_tables"),
                  (ebb) =>
                    jsonArrayFrom(
                      ebb
                        .selectFrom("character_calendar_fields")
                        .where("character_calendar_fields.character_id", "=", params.id)
                        .select([
                          "character_field_id as id",
                          "related_id",
                          "start_day",
                          "start_month_id",
                          "start_year",
                          "end_day",
                          "end_month_id",
                          "end_year",
                        ]),
                    ).as("field_calendars"),
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("character_value_fields")
                        .whereRef("character_value_fields.character_id", "=", "characters.id")
                        .select(["character_field_id as id", "value"]),
                    ).as("field_values"),
                ]);
              }
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
                        "characters.full_name",
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
                        "characters.full_name",
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
                        "characters.full_name",
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
                            "characters.full_name",
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
          const {
            field_documents,
            field_images,
            field_locations,
            field_blueprint_instances,
            field_calendars,
            field_events,
            field_random_tables,
            field_values,
            ...rest
          } = data;
          rest.character_fields = [
            ...(field_documents || []).map(
              (d: {
                id: string;
                related_id: string;
                documents: { document: { id: string; title: string; icon: string | null } }[];
              }) => ({
                id: d.id,
                documents: (d?.documents || []).map((document) => ({ related_id: d.related_id, document })),
              }),
            ),
            ...(field_images || []).map(
              (d: {
                id: string;
                related_id: string;
                images: { image: { id: string; title: string; icon: string | null } }[];
              }) => ({
                id: d.id,
                images: d.images.map((image) => ({
                  related_id: d.related_id,
                  image,
                })),
              }),
            ),
            ...(field_locations || []).map(
              (d: {
                id: string;
                related_id: string;
                map_pins: { map_pin: { id: string; title: string; icon: string | null } }[];
              }) => ({
                id: d.id,
                map_pins: d.map_pins.map((map_pin) => ({
                  related_id: d.related_id,
                  map_pin,
                })),
              }),
            ),
            ...(field_events || []).map(
              (d: {
                id: string;
                related_id: string;
                events: { event: { id: string; title: string; parent_id: string } }[];
              }) => ({
                id: d.id,
                events: d.events.map((event) => ({
                  related_id: d.related_id,
                  event,
                })),
              }),
            ),
            ...(field_blueprint_instances || []).map(
              (d: {
                id: string;
                related_id: string;
                blueprint_instances: { blueprint_instance: { id: string; title: string; icon: string | null } }[];
              }) => ({
                id: d.id,
                blueprint_instances: d.blueprint_instances.map((blueprint_instance) => ({
                  related_id: d.related_id,
                  blueprint_instance,
                })),
              }),
            ),
            ...(field_calendars || []).map(
              (d: {
                id: string;
                related_id: string;
                start_day?: number;
                start_month_id?: string;
                start_year?: number;
                end_day?: number;
                end_month_id?: string;
                end_year?: number;
              }) => ({
                id: d.id,
                calendar: {
                  related_id: d.related_id,
                  start_day: d.start_day,
                  start_month_id: d.start_month_id,
                  start_year: d.start_year,
                  end_day: d.end_day,
                  end_month_id: d.end_month_id,
                  end_year: d.end_year,
                },
              }),
            ),
            ...(field_random_tables || []).map(
              (d: { id: string; related_id: string; option_id?: string; suboption_id?: string }) => ({
                id: d.id,
                random_table: {
                  related_id: d.related_id,
                  option_id: d.option_id,
                  suboption_id: d.suboption_id,
                },
              }),
            ),
            ...(field_values || []),
          ];
          return { data: rest, message: MessageEnum.success, ok: true };
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

          const initialEdges = uniqueChars.flatMap((c) => {
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

          const edges = uniqBy(initialEdges, (edge) => [edge.source_id, edge.target_id]);
          // Get ids of main branch/parent characters and their generations

          return { data: { nodes, edges }, ok: true, message: MessageEnum.success };
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

            if (body.relations?.character_fields) {
              await Promise.all(
                body.relations.character_fields.flatMap(async (field) => {
                  if (field.value || field.value === "") {
                    return tx
                      .insertInto("character_value_fields")
                      .values({
                        character_field_id: field.id,
                        character_id: params.id,
                        value: JSON.stringify(field.value),
                      })
                      .onConflict((oc) =>
                        oc.columns(["character_field_id", "character_id"]).doUpdateSet({ value: JSON.stringify(field.value) }),
                      )
                      .execute();
                  }

                  if (field.blueprint_instances) {
                    await tx
                      .deleteFrom("character_blueprint_instance_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return field.blueprint_instances.map((char) =>
                      tx
                        .insertInto("character_blueprint_instance_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: char.related_id,
                        })
                        .execute(),
                    );
                  }
                  if (field.documents) {
                    await tx
                      .deleteFrom("character_documents_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return field.documents.map((char) =>
                      tx
                        .insertInto("character_documents_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: char.related_id,
                        })
                        .execute(),
                    );
                  }
                  if (field.map_pins) {
                    await tx
                      .deleteFrom("character_locations_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return field.map_pins.map((char) =>
                      tx
                        .insertInto("character_locations_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: char.related_id,
                        })
                        .execute(),
                    );
                  }
                  if (field.images) {
                    await tx
                      .deleteFrom("character_images_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return field.images.map((char) =>
                      tx
                        .insertInto("character_images_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: char.related_id,
                        })
                        .execute(),
                    );
                  }
                  if (field.events) {
                    await tx
                      .deleteFrom("character_events_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return field.events.map((char) =>
                      tx
                        .insertInto("character_events_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: char.related_id,
                        })
                        .execute(),
                    );
                  }
                  if (field.random_table) {
                    await tx
                      .deleteFrom("character_random_table_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return tx
                      .insertInto("character_random_table_fields")
                      .values({
                        character_field_id: field.id,
                        character_id: params.id,
                        related_id: field.random_table.related_id,
                        option_id: field.random_table.option_id,
                        suboption_id: field.random_table.suboption_id,
                      })
                      .execute();
                  }
                  if (field.calendar) {
                    await tx
                      .deleteFrom("character_calendar_fields")
                      .where("character_id", "=", params.id)
                      .where("character_field_id", "=", field.id)
                      .execute();
                    return tx
                      .insertInto("character_calendar_fields")
                      .values({
                        character_field_id: field.id,
                        character_id: params.id,
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
                  const newTagIds = (body.relations?.tags || []).map((t) => t.id);
                  const templates = await tx
                    .selectFrom("_character_fields_templatesTotags")
                    .where("_character_fields_templatesTotags.B", "in", deletedTags)
                    .select([
                      (eb) =>
                        jsonArrayFrom(
                          eb
                            .selectFrom("character_fields_templates")
                            .select([
                              (ebb) =>
                                jsonArrayFrom(
                                  ebb
                                    .selectFrom("character_fields")
                                    .select(["id", "field_type"])
                                    .whereRef("character_fields.parent_id", "=", "character_fields_templates.id"),
                                ).as("character_fields"),
                              (ebb) =>
                                jsonArrayFrom(
                                  ebb
                                    .selectFrom("tags")
                                    .leftJoin(
                                      "_character_fields_templatesTotags",
                                      "_character_fields_templatesTotags.A",
                                      "character_fields_templates.id",
                                    )
                                    .whereRef("_character_fields_templatesTotags.A", "=", "character_fields_templates.id")
                                    .select("_character_fields_templatesTotags.B as id"),
                                ).as("tags"),
                            ]),
                        ).as("templates"),
                    ])

                    .where("_character_fields_templatesTotags.B", "in", deletedTags)
                    .execute();
                  const documentFields: { id: string; field_type: string }[] = [];
                  const mapPinFields: { id: string; field_type: string }[] = [];
                  const blueprintInstanceFields: { id: string; field_type: string }[] = [];
                  const imageFields: { id: string; field_type: string }[] = [];
                  // const randomTableFields = [];
                  // const calendarFields = [];
                  const valueFields: { id: string; field_type: string }[] = [];
                  templates
                    .flatMap((t) => t.templates)
                    .filter((temp) => !temp.tags.some((t) => t.id && newTagIds.includes(t.id)))
                    .flatMap((t) => t.character_fields)
                    .forEach((field) => {
                      if (field.field_type.includes("documents")) documentFields.push(field);
                      if (field.field_type.includes("location")) mapPinFields.push(field);
                      if (field.field_type.includes("blueprint")) blueprintInstanceFields.push(field);
                      if (field.field_type.includes("images")) imageFields.push(field);
                      valueFields.push(field);
                    });
                  if (documentFields.length) {
                    await tx
                      .deleteFrom("character_documents_fields")
                      .where(
                        "character_field_id",
                        "in",
                        documentFields.map((f) => f.id),
                      )
                      .where("character_documents_fields.character_id", "=", params.id)
                      .execute();
                  }
                  if (mapPinFields.length) {
                    await tx
                      .deleteFrom("character_locations_fields")
                      .where(
                        "character_field_id",
                        "in",
                        mapPinFields.map((f) => f.id),
                      )
                      .where("character_locations_fields.character_id", "=", params.id)
                      .execute();
                  }
                  if (blueprintInstanceFields.length) {
                    await tx
                      .deleteFrom("character_blueprint_instance_fields")
                      .where(
                        "character_field_id",
                        "in",
                        blueprintInstanceFields.map((f) => f.id),
                      )
                      .where("character_blueprint_instance_fields.character_id", "=", params.id)
                      .execute();
                  }
                  if (imageFields.length) {
                    await tx
                      .deleteFrom("character_images_fields")
                      .where(
                        "character_field_id",
                        "in",
                        imageFields.map((f) => f.id),
                      )
                      .where("character_images_fields.character_id", "=", params.id)
                      .execute();
                  }

                  if (valueFields.length) {
                    await tx
                      .deleteFrom("character_value_fields")
                      .where(
                        "character_field_id",
                        "in",
                        valueFields.map((f) => f.id),
                      )
                      .where("character_value_fields.character_id", "=", params.id)
                      .execute();
                  }
                }
                // if all tags are removed, remove all fields
                else {
                  await Promise.all([
                    tx
                      .deleteFrom("character_documents_fields")
                      .where("character_documents_fields.character_id", "=", params.id)
                      .execute(),
                    tx
                      .deleteFrom("character_images_fields")
                      .where("character_images_fields.character_id", "=", params.id)
                      .execute(),
                    tx
                      .deleteFrom("character_blueprint_instance_fields")
                      .where("character_blueprint_instance_fields.character_id", "=", params.id)
                      .execute(),
                    tx
                      .deleteFrom("character_locations_fields")
                      .where("character_locations_fields.character_id", "=", params.id)
                      .execute(),
                    tx
                      .deleteFrom("character_value_fields")
                      .where("character_value_fields.character_id", "=", params.id)
                      .execute(),
                  ]);
                }
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
            if (body.data) await tx.updateTable("characters").where("characters.id", "=", params.id).set(body.data).execute();
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
      .post(
        "/remove/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body?.relations?.documents) {
              await tx
                .deleteFrom("_charactersTodocuments")
                .where("A", "=", params.id)
                .where(
                  "B",
                  "in",
                  body.relations.documents.map((d) => d.id),
                )
                .execute();
            }
            if (body?.relations?.images) {
              await tx
                .deleteFrom("_charactersToimages")
                .where("A", "=", params.id)
                .where(
                  "B",
                  "in",
                  body.relations.images.map((d) => d.id),
                )
                .execute();
            }
            if (body?.relations?.tags) {
              await tx
                .deleteFrom("_charactersTotags")
                .where("A", "=", params.id)
                .where(
                  "B",
                  "in",
                  body.relations.tags.map((d) => d.id),
                )
                .execute();
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
          const data = await db
            .deleteFrom("characters")
            .where("characters.id", "=", params.id)
            .returning(["id", "full_name as title", "project_id", "portrait_id as image_id"])
            .executeTakeFirstOrThrow();

          return { data, message: `Character ${MessageEnum.successfully_deleted}.`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
