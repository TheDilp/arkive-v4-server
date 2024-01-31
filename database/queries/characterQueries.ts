import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import uniqBy from "lodash.uniqby";

import { MessageEnum } from "../../enums";
import { ResponseWithDataSchema } from "../../types/requestTypes";
import { TagQuery } from "../../utils/relationalQueryHelpers";
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
              .$if(isPublic, (eb) => eb.where("images.is_public", "=", true)),
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
              .$if(isPublic, (eb) => eb.where("map_pins.is_public", "=", true))
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
              .$if(isPublic, (eb) => eb.where("documents.is_public", "=", true))
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
              .$if(isPublic, (eb) => eb.where("events.is_public", "=", true))
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
      (d: { id: string; related_id: string; images: { image: { id: string; title: string; icon: string | null } }[] }) => ({
        id: d.id,
        images: d.images.map((image) => ({
          related_id: d.related_id,
          image,
        })),
      }),
    ),
    ...(field_locations || []).map(
      (d: { id: string; related_id: string; map_pins: { map_pin: { id: string; title: string; icon: string | null } }[] }) => ({
        id: d.id,
        map_pins: d.map_pins.map((map_pin) => ({
          related_id: d.related_id,
          map_pin,
        })),
      }),
    ),
    ...(field_events || []).map(
      (d: { id: string; related_id: string; events: { event: { id: string; title: string; parent_id: string } }[] }) => ({
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
    ...(field_random_tables || []).map((d: { id: string; related_id: string; option_id?: string; suboption_id?: string }) => ({
      id: d.id,
      random_table: {
        related_id: d.related_id,
        option_id: d.option_id,
        suboption_id: d.suboption_id,
      },
    })),
    ...(field_values || []),
  ];
  if (isPublic) {
    if (data?.is_public) return { data: rest, message: MessageEnum.success, ok: true };
    return { data: { is_public: false }, message: MessageEnum.success, ok: true };
  }
  return { data: rest, message: MessageEnum.success, ok: true };
}
