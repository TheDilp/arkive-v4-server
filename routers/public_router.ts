import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import {
  BasicSearchSchema,
  EntityListSchema,
  ReadCalendarSchema,
  ReadCharacterSchema,
  ReadDictionarySchema,
  ReadDocumentSchema,
  ReadEventSchema,
  ReadGraphSchema,
  ReadMapSchema,
  ReadWordSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery } from "../utils/relationalQueryHelpers";

export function public_router(app: Elysia) {
  return app.group("/public", (server) => {
    return server
      .post(
        "/projects/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("projects")
            .where("id", "=", params.id)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "projects">[]))
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/blueprint_instances/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("blueprint_instances")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields as SelectExpression<DB, "blueprint_instances">[]),
            )
            .where("blueprint_instances.id", "=", params.id)
            .where("blueprint_instances.is_public", "=", true)
            .executeTakeFirst();

          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/characters/:id",
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
                      .where("characters.is_public", "=", true)
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
                      .where("characters.is_public", "=", true)
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
                      .where("characters.is_public", "=", true)
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
                          .where("characters.is_public", "=", true)
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
                      .where("map_pins.is_public", "=", true)
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
                      .where("documents.is_public", "=", true)
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
          // If fetching direct relationships return only unique relationships

          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/documents/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("documents")
            .where("id", "=", params.id)
            .where("is_public", "=", true)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "documents">[]))
            .executeTakeFirst();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };

          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDocumentSchema,
          response: t.Union([ResponseWithDataSchema, ResponseSchema]),
        },
      )
      .post(
        "/maps/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("maps")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "maps">[]))
            .where("maps.id", "=", params.id)
            .where("maps.is_public", "=", true)
            .$if(!!body?.relations?.map_pins, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("map_pins")
                    .select([
                      "map_pins.id",
                      "map_pins.background_color",
                      "map_pins.border_color",
                      "map_pins.color",
                      "map_pins.character_id",
                      "map_pins.doc_id",
                      "map_pins.icon",
                      "map_pins.title",
                      "map_pins.parent_id",
                      "map_pins.is_public",
                      "map_pins.lat",
                      "map_pins.lng",
                      "map_pins.map_link",
                      "map_pins.show_background",
                      "map_pins.show_border",
                      "map_pins.map_pin_type_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("characters")
                            .whereRef("characters.id", "=", "map_pins.character_id")
                            .select(["id", "full_name", "portrait_id"]),
                        ).as("character"),
                    ])
                    .whereRef("map_pins.parent_id", "=", "maps.id")
                    .where("map_pins.is_public", "=", true),
                ).as("map_pins"),
              ),
            )
            .$if(!!body?.relations?.map_layers, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("map_layers")
                    .select([
                      "map_layers.id",
                      "map_layers.title",
                      "map_layers.image_id",
                      "map_layers.is_public",
                      "map_layers.parent_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("images")
                            .whereRef("images.id", "=", "map_layers.image_id")
                            .select(["images.id", "images.title"]),
                        ).as("image"),
                    ])
                    .whereRef("map_layers.parent_id", "=", "maps.id")
                    .where("map_layers.is_public", "=", true),
                ).as("map_layers"),
              ),
            )
            .executeTakeFirst();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadMapSchema,
          response: t.Union([ResponseWithDataSchema, ResponseSchema]),
        },
      )
      .post(
        "/graphs/:id",
        async ({ params, body }) => {
          const data = await db

            .selectFrom("graphs")
            .where("graphs.id", "=", params.id)
            .where("graphs.is_public", "=", true)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "graphs">[]))
            .$if(!!body?.relations?.nodes, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("nodes")
                    .where("nodes.parent_id", "=", params.id)
                    .select((sb) => [
                      "nodes.id",
                      "nodes.label",
                      "nodes.icon",
                      "nodes.background_color",
                      "nodes.background_opacity",
                      "nodes.font_color",
                      "nodes.font_family",
                      "nodes.font_size",
                      "nodes.type",
                      "nodes.image_id",
                      "nodes.text_h_align",
                      "nodes.text_v_align",
                      "nodes.x",
                      "nodes.y",
                      "nodes.z_index",
                      "nodes.width",
                      "nodes.height",
                      "nodes.is_locked",
                      jsonObjectFrom(
                        sb
                          .selectFrom("characters")
                          .select(["characters.first_name", "characters.last_name", "characters.portrait_id"])
                          .whereRef("characters.id", "=", "nodes.character_id"),
                      ).as("character"),
                    ]),
                ).as("nodes"),
              ),
            )
            .$if(!!body?.relations?.edges, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(eb.selectFrom("edges").where("edges.parent_id", "=", params.id).selectAll()).as("edges"),
              ),
            )

            .executeTakeFirst();

          if (data?.is_public)
            return {
              data,
              message: MessageEnum.success,
              ok: true,
            };

          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadGraphSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/calendars/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("calendars")
            .where("calendars.id", "=", params.id)
            .where("calendars.is_public", "=", true)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "calendars">[]))
            .$if(!!body?.relations, (qb) => {
              if (body.relations?.months) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("months")
                      .select(["months.id", "months.days", "months.sort", "months.title", "months.parent_id"])
                      .where("months.parent_id", "=", params.id),
                  ).as("months"),
                );
              }
              if (body.relations?.leap_days) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("leap_days")
                      .select(["leap_days.id", "leap_days.month_id", "leap_days.parent_id", "leap_days.conditions"])
                      .where("leap_days.parent_id", "=", params.id),
                  ).as("leap_days"),
                );
              }

              return qb;
            })
            .executeTakeFirst();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCalendarSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("events")

            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("events", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .where("is_public", "=", true)
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/dictionaries/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("dictionaries")
            .where("id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "dictionaries">[]))
            .$if(!!body.relations?.words, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("words")
                    .select(["words.id", "words.title", "words.translation"])
                    .where("words.parent_id", "=", params.id),
                ).as("words"),
              ),
            )

            .executeTakeFirst();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDictionarySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/words/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("words")
            .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
            .where("words.id", "=", params.id)
            .where("dictionaries.is_public", "=", true)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(
                // @ts-ignore
                body.fields.map((f) => `words.${f}`).concat("dictionaries.is_public") as SelectExpression<DB, "words">[],
              ),
            )
            .executeTakeFirst();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadWordSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/events/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("events")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .where("events.id", "=", params.id)
            .where("events.is_public", "=", true)
            .executeTakeFirst();

          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadEventSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/events",
        async ({ body }) => {
          const data = await db
            .selectFrom("events")

            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("events", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .where("is_public", "=", true)
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/search/:project_id",
        async ({ params, body }) => {
          const { project_id } = params;
          const { search_term } = body.data;
          const charactersSearch = {
            name: "characters",
            request: db
              .selectFrom("characters")
              .select(["id", "full_name as label", "portrait_id as image"])
              .where("characters.full_name", "ilike", `%${search_term}%`)
              .where("characters.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const documentSearch = {
            name: "documents",
            request: db
              .selectFrom("documents")
              .select(["id", "title as label", "icon"])
              .where("documents.title", "ilike", `%${search_term}%`)
              .where("documents.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };

          const mapSearch = {
            name: "maps",
            request: db
              .selectFrom("maps")
              .select(["id", "title as label"])
              .where("maps.title", "ilike", `%${search_term}%`)
              .where("maps.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };

          const mapPinSearch = {
            name: "map_pins",
            request: db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .where("maps.is_public", "=", true)
              .where("map_pins.title", "is not", null)
              .where("map_pins.title", "ilike", `%${search_term}%`)
              .select([
                "map_pins.id",
                "map_pins.title as label",
                "map_pins.icon",
                "map_pins.parent_id",
                "maps.title as parent_title",
              ])
              .limit(5),
          };
          const characterMapPinSearch = {
            name: "character_map_pins",
            request: db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .leftJoin("characters", "characters.id", "map_pins.character_id")
              .where("map_pins.character_id", "is not", null)
              .where("maps.is_public", "=", true)
              .where("characters.full_name", "ilike", `%${search_term}%`)
              .where("characters.is_public", "=", true)
              .select([
                "map_pins.id",
                "map_pins.icon",
                "map_pins.parent_id",
                "maps.title as parent_title",
                "characters.full_name as label",
                "characters.portrait_id",
              ])
              .limit(5),
          };

          const graphSearch = {
            name: "graphs",
            request: db
              .selectFrom("graphs")
              .where("graphs.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["id", "title as label", "icon"])
              .limit(5),
          };

          const blueprintInstancesSearch = {
            name: "blueprint_instances",
            request: db
              .selectFrom("blueprint_instances")
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprint_instances.title", "ilike", `%${search_term}%`)
              .where("blueprints.project_id", "=", project_id)
              .where("blueprint_instances.is_public", "=", true)
              .select([
                "blueprint_instances.id",
                "blueprint_instances.title as label",
                "blueprints.title as parent_title",
                "blueprint_instances.parent_id",
                "blueprints.icon",
              ])
              .limit(5),
          };

          const requests = [
            charactersSearch,
            documentSearch,
            mapSearch,
            mapPinSearch,
            characterMapPinSearch,
            graphSearch,
            blueprintInstancesSearch,
          ];
          const result = await Promise.all(
            requests.map(async (item) => ({
              name: item.name,
              result: await item.request.execute(),
            })),
          );
          return { data: result, ok: true, message: MessageEnum.success };
        },
        { body: BasicSearchSchema },
      );
  });
}
