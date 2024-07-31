import { Elysia, t } from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { readCharacter, updateCharacter } from "../database/queries";
import { UploadAssets } from "../database/queries/assetQueries";
import {
  GatewaySearchSchema,
  ListCharacterFieldsTemplateSchema,
  ReadCharacterSchema,
  UpdateCharacterSchema,
} from "../database/validation";
import { MessageEnum } from "../enums";
import { GatewayResponseSchema, ResponseWithDataSchema, SearchableEntities } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { redisClient } from "../utils/redisClient";
import { TagQuery } from "../utils/relationalQueryHelpers";
import { getSearchFields } from "../utils/searchUtils";
import { verifyGatewayJWT } from "../utils/userUtils";
import { groupRelationFiltersByField } from "../utils/utils";

export function gateway_access_router(app: Elysia) {
  return app.group("/gateway", (server) =>
    server
      .get("/access/:type/:access_id/:code", async ({ params, set }) => {
        const redis = await redisClient;

        const gateway_access = await redis.GET(`${params.type}_gateway_access_${params.access_id}`);
        const ttl = await redis.TTL(`${params.type}_gateway_access_${params.access_id}`);
        if (gateway_access) {
          try {
            const gateway_access_data = JSON.parse(gateway_access) as {
              access_id: string;
              entity_id: string;
              code: number;
              config: Record<string, string[]>;
            };
            if (gateway_access_data.code.toString() !== params.code) {
              set.status = 403;
              return { data: {}, ok: false, message: MessageEnum.gateway_access_code };
            }

            if (gateway_access_data.access_id === params.access_id) {
              const res = await fetch(
                `${process.env.ARKIVE_AUTH_URL}/auth/gateway/${params.type}/${params.access_id}/${params.code}`,
              );

              if (res.status >= 400) {
                set.status = res.status;
                console.error(await res.text());
                return { ok: false, message: MessageEnum.gateway_verify };
              }

              try {
                const data = (await res.text()) as string;

                set.headers["set-cookie"] = data;
                await redis.SET(
                  `${params.type}_gateway_access_${params.access_id}`,
                  JSON.stringify({ ...gateway_access_data }),
                  { EX: ttl || 60 * 60 },
                );

                return { ok: true, message: MessageEnum.success };
              } catch (error) {
                console.error(error);
                set.status = 403;
                return { ok: false, message: MessageEnum.gateway_verify };
              }

              // if (params.type === "characters") {
              //   let query = db
              //     .selectFrom("characters")
              //     .select([
              //       "characters.id",
              //       "characters.full_name",
              //       "characters.age",
              //       "characters.biography",
              //       "characters.nickname",
              //       "characters.portrait_id",
              //     ])
              //     .where("characters.id", "=", data.entity_id);

              //   query = query.select([
              //     (eb) => {
              //       let characters_query = eb
              //         .selectFrom("character_characters_fields")
              //         .where("character_characters_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_characters_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("characters")
              //                 .whereRef("characters.id", "=", "character_characters_fields.related_id")
              //                 .select(["characters.id", "characters.full_name", "characters.portrait_id"]),
              //             ).as("characters"),
              //         ]);

              //       return jsonArrayFrom(characters_query).as("field_characters");
              //     },
              //     (eb) => {
              //       let documents_query = eb
              //         .selectFrom("character_documents_fields")
              //         .where("character_documents_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_documents_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("documents")
              //                 .whereRef("documents.id", "=", "character_documents_fields.related_id")
              //                 .select(["documents.id", "documents.title", "documents.icon"]),
              //             ).as("documents"),
              //         ]);

              //       return jsonArrayFrom(documents_query).as("field_documents");
              //     },
              //     (eb) => {
              //       let image_query = eb
              //         .selectFrom("character_images_fields")
              //         .where("character_images_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_images_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("images")
              //                 .whereRef("images.id", "=", "character_images_fields.related_id")
              //                 .select(["id", "title"]),
              //             ).as("images"),
              //         ]);

              //       return jsonArrayFrom(image_query).as("field_images");
              //     },
              //     (eb) => {
              //       let event_query = eb
              //         .selectFrom("character_events_fields")
              //         .where("character_events_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_events_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("events")
              //                 .whereRef("events.id", "=", "character_events_fields.related_id")
              //                 .select(["id", "title", "parent_id"]),
              //             ).as("events"),
              //         ]);

              //       return jsonArrayFrom(event_query).as("field_events");
              //     },
              //     (eb) => {
              //       let map_pin_query = eb
              //         .selectFrom("character_locations_fields")
              //         .where("character_locations_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_locations_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("map_pins")
              //                 .whereRef("map_pins.id", "=", "character_locations_fields.related_id")
              //                 .select(["id", "title", "icon", "parent_id"]),
              //             ).as("map_pins"),
              //         ]);

              //       return jsonArrayFrom(map_pin_query).as("field_locations");
              //     },
              //     (eb) => {
              //       let bpi_query = eb
              //         .selectFrom("character_blueprint_instance_fields")
              //         .where("character_blueprint_instance_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_blueprint_instance_fields.related_id",
              //           (ebb) =>
              //             jsonArrayFrom(
              //               ebb
              //                 .selectFrom("blueprint_instances")
              //                 .whereRef("blueprint_instances.id", "=", "character_blueprint_instance_fields.related_id")
              //                 .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              //                 .select([
              //                   "blueprint_instances.id",
              //                   "blueprint_instances.title",
              //                   "blueprint_instances.parent_id",
              //                   "blueprints.icon",
              //                 ]),
              //             ).as("blueprint_instances"),
              //         ]);
              //       return jsonArrayFrom(bpi_query).as("field_blueprint_instances");
              //     },
              //     (ebb) => {
              //       let random_table_query = ebb
              //         .selectFrom("character_random_table_fields")
              //         .where("character_random_table_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_random_table_fields.related_id",
              //           "option_id",
              //           "suboption_id",
              //         ]);
              //       return jsonArrayFrom(random_table_query).as("field_random_tables");
              //     },
              //     (ebb) => {
              //       let calendar_query = ebb
              //         .selectFrom("character_calendar_fields")
              //         .where("character_calendar_fields.character_id", "=", data.entity_id)
              //         .select([
              //           "character_field_id as id",
              //           "character_calendar_fields.related_id",
              //           "start_day",
              //           "start_month_id",
              //           "start_year",
              //           "end_day",
              //           "end_month_id",
              //           "end_year",
              //         ]);

              //       return jsonArrayFrom(calendar_query).as("field_calendars");
              //     },
              //     (eb) =>
              //       jsonArrayFrom(
              //         eb
              //           .selectFrom("character_value_fields")
              //           .whereRef("character_value_fields.character_id", "=", "characters.id")
              //           .select(["character_field_id as id", "value"]),
              //       ).as("field_values"),
              //   ]);
              //   query = query.select((eb) => {
              //     let portrait_query = eb
              //       .selectFrom("images")
              //       .whereRef("images.id", "=", "characters.portrait_id")
              //       .select(["images.id", "images.title"]);

              //     return jsonObjectFrom(portrait_query).as("portrait");
              //   });

              //   let char_data: Record<string, any> = await query.executeTakeFirstOrThrow();

              //   const {
              //     field_characters,
              //     field_documents,
              //     field_images,
              //     field_locations,
              //     field_blueprint_instances,
              //     field_calendars,
              //     field_events,
              //     field_random_tables,
              //     field_values,
              //     ...rest
              //   } = char_data;
              //   rest.character_fields = groupCharacterFields([
              //     ...(field_characters || []).map(
              //       (d: {
              //         id: string;
              //         related_id: string;
              //         characters: { character: { id: string; full_name: string; portrait_id: string | null } }[];
              //       }) => ({
              //         id: d.id,
              //         characters: (d?.characters || []).map((character) => ({ related_id: d.related_id, character })),
              //       }),
              //     ),
              //     ...(field_documents || [])
              //       .map(
              //         (d: {
              //           id: string;
              //           related_id: string;
              //           documents: { document: { id: string; title: string; icon: string | null } }[];
              //         }) => ({
              //           id: d.id,
              //           documents: (d?.documents || []).map((document) => ({ related_id: d.related_id, document })),
              //         }),
              //       )
              //       .filter((item: { documents: any[] }) => item.documents.length),
              //     ...(field_images || [])
              //       .map(
              //         (d: {
              //           id: string;
              //           related_id: string;
              //           images: { image: { id: string; title: string; icon: string | null } }[];
              //         }) => ({
              //           id: d.id,
              //           images: d.images.map((image) => ({
              //             related_id: d.related_id,
              //             image,
              //           })),
              //         }),
              //       )
              //       .filter((item: { images: any[] }) => item.images.length),

              //     ...(field_locations || [])
              //       .map(
              //         (d: {
              //           id: string;
              //           related_id: string;
              //           map_pins: { map_pin: { id: string; title: string; icon: string | null } }[];
              //         }) => ({
              //           id: d.id,
              //           map_pins: d.map_pins.map((map_pin) => ({
              //             related_id: d.related_id,
              //             map_pin,
              //           })),
              //         }),
              //       )
              //       .filter((item: { map_pins: any[] }) => item.map_pins.length),

              //     ...(field_events || [])
              //       .map(
              //         (d: {
              //           id: string;
              //           related_id: string;
              //           events: { event: { id: string; title: string; parent_id: string } }[];
              //         }) => ({
              //           id: d.id,
              //           events: d.events.map((event) => ({
              //             related_id: d.related_id,
              //             event,
              //           })),
              //         }),
              //       )
              //       .filter((item: { events: any[] }) => item.events.length),

              //     ...(field_blueprint_instances || [])
              //       .map(
              //         (d: {
              //           id: string;
              //           related_id: string;
              //           blueprint_instances: { blueprint_instance: { id: string; title: string; icon: string | null } }[];
              //         }) => ({
              //           id: d.id,
              //           blueprint_instances: d.blueprint_instances.map((blueprint_instance) => ({
              //             related_id: d.related_id,
              //             blueprint_instance,
              //           })),
              //         }),
              //       )
              //       .filter((item: { blueprint_instances: any[] }) => item.blueprint_instances.length),
              //     ...(field_calendars || []).map(
              //       (d: {
              //         id: string;
              //         related_id: string;
              //         start_day?: number;
              //         start_month_id?: string;
              //         start_year?: number;
              //         end_day?: number;
              //         end_month_id?: string;
              //         end_year?: number;
              //       }) => ({
              //         id: d.id,
              //         calendar: {
              //           related_id: d.related_id,
              //           start_day: d.start_day,
              //           start_month_id: d.start_month_id,
              //           start_year: d.start_year,
              //           end_day: d.end_day,
              //           end_month_id: d.end_month_id,
              //           end_year: d.end_year,
              //         },
              //       }),
              //     ),
              //     ...(field_random_tables || []).map(
              //       (d: { id: string; related_id: string; option_id?: string; suboption_id?: string }) => ({
              //         id: d.id,
              //         random_table: {
              //           related_id: d.related_id,
              //           option_id: d.option_id,
              //           suboption_id: d.suboption_id,
              //         },
              //       }),
              //     ),
              //   ]);
              //   rest.character_fields.push(...(field_values || []));
            }
          } catch (error) {
            console.error(error);
            return false;
          }
        }
        return {};
      })
      .guard({
        beforeHandle: async ({ cookie: { access }, set, headers }) => {
          const data = await verifyGatewayJWT({ access, set });

          if (data.status === "allowed") {
            if (data.project_id) headers["project-id"] = data.project_id;
            return;
          } else {
            set.status = 403;
            return { ok: false, message: MessageEnum.gateway_verify };
          }
        },
      })
      .post(
        "/characters/:id",
        async ({ params, body }) => {
          return readCharacter(
            body,
            params,
            {
              is_project_owner: true,
              user_id: "",
              role_id: null,
              role_access: false,
              project_id: null,
              permission_id: "",
            },
            false,
          );
        },
        { body: ReadCharacterSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/characters/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            await updateCharacter({ tx, params, body, permissions: { user_id: undefined, is_project_owner: true } });
          });

          return { ok: true, message: `Character ${MessageEnum.successfully_updated}` };
        },
        { body: UpdateCharacterSchema, response: GatewayResponseSchema },
      )
      .post(
        "/character_fields_templates",
        async ({ body }) => {
          let query = db
            .selectFrom("character_fields_templates")
            .distinctOn(
              body.orderBy?.length
                ? (["character_fields_templates.id", ...body.orderBy.map((order) => order.field)] as any)
                : "character_fields_templates.id",
            )
            .where("character_fields_templates.project_id", "=", body.data.project_id)
            .where("character_fields_templates.deleted_at", body.arkived ? "is not" : "is", null)
            .select(
              (body.fields || [])?.map((field) => `character_fields_templates.${field}`) as SelectExpression<
                DB,
                "character_fields_templates"
              >[],
            );

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("character_fields_templates", query, body.filters);
          }
          if (!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length) {
            const { tags } = groupRelationFiltersByField(body.relationFilters || {});
            if (tags?.filters?.length)
              query = tagsRelationFilter(
                "character_fields_templates",
                "_character_fields_templatesTotags",
                query,
                tags?.filters || [],
                false,
              );
          }
          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }
          if (body?.relations) {
            if (body?.relations?.character_fields) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields")
                    .whereRef("character_fields_templates.id", "=", "character_fields.parent_id")
                    .select([
                      "character_fields.id",
                      "character_fields.title",
                      "character_fields.field_type",
                      "character_fields.options",
                      "character_fields.sort",
                      "character_fields.formula",
                      "character_fields.random_table_id",
                      "character_fields.blueprint_id",
                      "character_fields.section_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select([
                              "calendars.id",
                              "calendars.title",
                              "calendars.days",
                              (sb) =>
                                jsonArrayFrom(
                                  sb
                                    .selectFrom("months")
                                    .select(["months.id", "months.title", "months.days"])
                                    .orderBy("months.sort")
                                    .whereRef("months.parent_id", "=", "calendars.id"),
                                ).as("months"),
                            ])
                            .whereRef("calendars.id", "=", "character_fields.calendar_id"),
                        ).as("calendar"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select([
                              "random_tables.id",
                              "random_tables.title",
                              (ebb) =>
                                jsonArrayFrom(
                                  ebb
                                    .selectFrom("random_table_options")
                                    .whereRef("random_tables.id", "=", "random_table_options.parent_id")
                                    .select([
                                      "id",
                                      "title",
                                      (ebbb) =>
                                        jsonArrayFrom(
                                          ebbb
                                            .selectFrom("random_table_suboptions")
                                            .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id")
                                            .select(["id", "title"]),
                                        ).as("random_table_suboptions"),
                                    ]),
                                ).as("random_table_options"),
                            ])
                            .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                        ).as("random_table"),
                    ])
                    .orderBy(["character_fields.sort"]),
                ).as("character_fields"),
              );
            }
            if (body?.relations?.character_fields_sections) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields_sections")
                    .select([
                      "character_fields_sections.id",
                      "character_fields_sections.title",
                      "character_fields_sections.sort",
                    ])
                    .whereRef("character_fields_sections.parent_id", "=", "character_fields_templates.id")
                    .orderBy("character_fields_sections.sort asc"),
                ).as("character_fields_sections"),
              );
            }
            if (body?.relations?.tags) {
              query = query.select((eb) =>
                TagQuery(eb, "_character_fields_templatesTotags", "character_fields_templates", true, ""),
              );
            }
          }

          const data = await query.execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListCharacterFieldsTemplateSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/assets/upload/:entity_id",
        async ({ params, headers, body }) => {
          const project_id = headers?.["project-id"];
          if (project_id) {
            const project = await db
              .selectFrom("projects")
              .where("id", "=", project_id)
              .select(["owner_id"])
              .executeTakeFirst();
            if (project?.owner_id) {
              const ids = await UploadAssets({ type: "images", project_id, body, permissions: { user_id: project?.owner_id } });

              if (ids.length === 1) {
                await db.updateTable("characters").where("id", "=", params.entity_id).set("portrait_id", ids[0]).execute();
              }

              return { ok: true, message: MessageEnum.success };
            }
            return { ok: false, message: "There was an error with this request." };
          }
          return { ok: false, message: "There was an error with this request." };
        },
        { body: t.Record(t.String(), t.File({ maxSize: "50m" })), response: GatewayResponseSchema },
      )
      .post(
        "/options/:type",
        async ({ params, body }) => {
          const { type } = params;
          const redis = await redisClient;

          const gateway_access = await redis.GET(`${body.data.entity_type}_gateway_access_${body.data.access_id}`);
          if (gateway_access) {
            try {
              const gateway_access_data = JSON.parse(gateway_access) as {
                access_id: string;
                entity_id: string;
                code: number;
                config: Record<
                  "characters" | "blueprint_instances" | "documents" | "maps" | "map_pins" | "events" | "images",
                  string[]
                >;
              };

              const entities = Object.entries(gateway_access_data?.config || {});
              const requests = [];
              for (let index = 0; index < entities.length; index++) {
                const entity = entities[index][0] as
                  | "characters"
                  | "blueprint_instances"
                  | "documents"
                  | "maps"
                  | "map_pins"
                  | "events"
                  | "images";
                const ids = entities[index][1];
                if (ids.length) {
                  const fields = getSearchFields(entity, true);

                  let query = db
                    .selectFrom(entity)
                    // @ts-ignore
                    .select(fields as SelectExpression<DB, SearchableEntities>[])
                    .select(sql`${entity}::TEXT`.as("entity_type"));
                  if (entity === "map_pins") {
                    query = query.leftJoin("maps", "maps.id", "map_pins.parent_id").select(["maps.title as parent_title"]);
                  } else if (entity === "events") {
                    query = query
                      .leftJoin("calendars", "calendars.id", "events.parent_id")
                      .select(["calendars.title as parent_title"]);
                  } else if (entity === "blueprint_instances") {
                    query = query
                      .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                      .select(["blueprints.icon as icon"]);
                  } else if (entity === "images") {
                    query = query.where("type", "=", "images");
                  }

                  query = query.where(`${entity}.id`, "in", ids);

                  requests.push(query.execute());
                }
              }

              const result = (await Promise.all(requests)).flat();
              return {
                data: result.map((item) => ({
                  value: item.id,
                  label: item?.full_name || item.title,
                  parent_id: "parent_id" in item ? item?.parent_id : null,
                  image:
                    type === "characters" || (type === "nodes" && item?.first_name)
                      ? item.portrait_id || ""
                      : item?.image_id || "",
                  icon: item?.icon,
                  entity_type: item?.entity_type,
                  project_id: item?.project_id,
                })),
                message: MessageEnum.success,
                ok: true,
                role_access: true,
              };
            } catch (error) {
              console.error(error);
              return { data: [], ok: false, message: "There was an error with this request.", role_access: true };
            }
          }
          return { data: [], ok: false, message: "There was an error with this request.", role_access: true };
        },
        {
          response: ResponseWithDataSchema,
          body: GatewaySearchSchema,
        },
      ),
  );
}
