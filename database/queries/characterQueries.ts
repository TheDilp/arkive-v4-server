import { randomUUID } from "crypto";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";

import { MessageEnum } from "../../enums";
import { ResponseWithDataSchema } from "../../types/requestTypes";
import { TagQuery } from "../../utils/relationalQueryHelpers";
import { groupCharacterFields } from "../../utils/transform";
import { db } from "../db";
import { ReadCharacterSchema } from "../validation";

type bodyTp = (typeof ReadCharacterSchema)["static"];

export async function readCharacter(
  body: bodyTp,
  params: { id: string },
  isPublic: boolean,
): Promise<(typeof ResponseWithDataSchema)["static"]> {
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
                        .select(["id", "title", "icon"])
                        .$if(isPublic, (eb) => {
                          eb = eb.where("is_public", "=", true);
                          return eb;
                        }),
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
                        .select(["id", "title"])
                        .$if(isPublic, (eb) => {
                          eb = eb.where("is_public", "=", true);
                          return eb;
                        }),
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
                        .select(["id", "title", "parent_id"])
                        .$if(isPublic, (eb) => {
                          eb = eb.where("is_public", "=", true);
                          return eb;
                        }),
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
                        .select(["id", "title", "icon", "parent_id"])
                        .$if(isPublic, (eb) => {
                          eb = eb.where("is_public", "=", true);
                          return eb;
                        }),
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
                        .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                        .select([
                          "blueprint_instances.id",
                          "blueprint_instances.title",
                          "blueprint_instances.parent_id",
                          "blueprints.icon",
                        ])
                        .$if(isPublic, (eb) => {
                          eb = eb.where("is_public", "=", true);
                          return eb;
                        }),
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
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))

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
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
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
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
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
                  .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
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
            eb.selectFrom("images").whereRef("images.id", "=", "characters.portrait_id").select(["images.id", "images.title"]),
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
              .select(["images.id", "images.title", "images.is_public"])
              .orderBy("title")
              .$if(isPublic, (eb) => {
                eb = eb.where("images.is_public", "=", true);
                return eb;
              }),
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
              .$if(isPublic, (eb) => {
                eb = eb.where("map_pins.is_public", "=", true);

                return eb;
              })
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
              .$if(isPublic, (eb) => {
                eb = eb.where("documents.is_public", "=", true);
                return eb;
              })
              .select(["documents.id", "documents.icon", "documents.is_public", "documents.title", "documents.image_id"])
              .orderBy("title"),
          ).as("documents"),
        );
      }
      if (body?.relations?.events) {
        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("event_characters")
              .where("event_characters.related_id", "=", params.id)
              .leftJoin("events", "events.id", "event_characters.event_id")
              .$if(isPublic, (eb) => {
                eb = eb.where("events.is_public", "=", true);
                return eb;
              })
              .select(["events.id", "events.is_public", "events.title", "events.image_id", "events.parent_id"])
              .orderBy("start_year"),
          ).as("events"),
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
  rest.character_fields = groupCharacterFields([
    ...(field_documents || [])
      .map(
        (d: {
          id: string;
          related_id: string;
          documents: { document: { id: string; title: string; icon: string | null } }[];
        }) => ({
          id: d.id,
          documents: (d?.documents || []).map((document) => ({ related_id: d.related_id, document })),
        }),
      )
      .filter((item: { documents: any[] }) => item.documents.length),
    ...(field_images || [])
      .map(
        (d: { id: string; related_id: string; images: { image: { id: string; title: string; icon: string | null } }[] }) => ({
          id: d.id,
          images: d.images.map((image) => ({
            related_id: d.related_id,
            image,
          })),
        }),
      )
      .filter((item: { images: any[] }) => item.images.length),

    ...(field_locations || [])
      .map(
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
      )
      .filter((item: { map_pins: any[] }) => item.map_pins.length),

    ...(field_events || [])
      .map((d: { id: string; related_id: string; events: { event: { id: string; title: string; parent_id: string } }[] }) => ({
        id: d.id,
        events: d.events.map((event) => ({
          related_id: d.related_id,
          event,
        })),
      }))
      .filter((item: { events: any[] }) => item.events.length),

    ...(field_blueprint_instances || [])
      .map(
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
      )
      .filter((item: { blueprint_instances: any[] }) => item.blueprint_instances.length),
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
    ...(field_random_tables || []).map((d: { id: string; related_id: string; option_id?: string; suboption_id?: string }) => ({
      id: d.id,
      random_table: {
        related_id: d.related_id,
        option_id: d.option_id,
        suboption_id: d.suboption_id,
      },
    })),
    ...(field_values || []),
  ]);
  if (isPublic) {
    if (data?.is_public) return { data: rest, message: MessageEnum.success, ok: true };
    return { data: { is_public: false }, message: MessageEnum.success, ok: true };
  }
  return { data: rest, message: MessageEnum.success, ok: true };
}

export async function getCharacterFamily(params: { id: string; relation_type_id: string; count: string }, isPublic: boolean) {
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
      .$if(isPublic, (qb) => {
        if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

        return qb;
      })
      .select([
        "characters.id",
        "characters.full_name",
        "characters.portrait_id",
        "characters.project_id",
        "characters.is_public",
      ])
      .union(
        db
          .selectFrom("characters_relationships")
          .where((eb) => eb.and([eb("character_b_id", "=", id), eb("relation_type_id", "=", relation_type_id)]))
          .leftJoin("characters", "characters.id", "characters_relationships.character_a_id")
          .$if(isPublic, (qb) => {
            if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

            return qb;
          })
          .select(["characters.id", "characters.full_name", "portrait_id", "project_id", "characters.is_public"]),
      )
      .union(
        db
          .selectFrom("characters")
          .where("characters.id", "=", id)
          .$if(isPublic, (qb) => {
            if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

            return qb;
          })
          .select(["characters.id", "characters.full_name", "portrait_id", "project_id", "characters.is_public"]),
      )
      .execute();

    const nodes = targets.map((target) => ({
      id: target.id,
      character_id: target.id,
      label: target.full_name,
      width: 50,
      height: 50,
      image_id: target.portrait_id ?? [],
      is_locked: false,
    }));

    const edges = targets
      .filter((t) => t.id !== params.id && (isPublic ? t.is_public : true))
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
    .select(["id", "portrait_id", "full_name", "is_public"])
    .where("id", "in", ids)
    .$if(isPublic, (qb) => {
      if (isPublic) qb.where("characters.is_public", "=", isPublic);

      return qb;
    })
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
          .$if(isPublic, (qb) => {
            if (isPublic) qb.where("characters.is_public", "=", isPublic);

            return qb;
          })
          .select(["characters.id", "portrait_id", "full_name", "character_a_id", "characters.is_public"])
          .execute();
  const additionalCharsChildren = await db
    .selectFrom("characters")
    .leftJoin("characters_relationships", "character_a_id", "characters.id")
    .where("character_b_id", "in", ids)
    .where("characters.id", "not in", ids)
    .where("relation_type_id", "=", relation_type_id)
    .$if(isPublic, (qb) => {
      if (isPublic) qb.where("characters.is_public", "=", isPublic);

      return qb;
    })
    .select(["characters.id", "portrait_id", "full_name", "character_b_id", "characters.is_public"])

    .execute();

  const withParents = [...mainCharacters, ...additionalChars, ...additionalCharsChildren]
    .filter((char) => (isPublic ? char.is_public : true))
    .map((char) => {
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
    label: c.full_name,
    width: 50,
    height: 50,
    image_id: c.portrait_id ?? [],
    is_locked: false,
  }));

  const initialEdges = uniqueChars.flatMap((c) => {
    const base = [];
    if ("parents" in c && c?.parents.length) {
      const filteredParents = isPublic
        ? c.parents.filter((parent_id) => uniqueChars.some((char) => char.id === parent_id))
        : c.parents;
      if (filteredParents.length) {
        for (let index = 0; index < filteredParents.length; index++) {
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
    }

    if ("children" in c && c?.children.length) {
      const filteredChildren = isPublic
        ? c.children.filter((child_id) => uniqueChars.some((char) => char.id === child_id))
        : c.children;

      for (let index = 0; index < filteredChildren.length; index++) {
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
}
