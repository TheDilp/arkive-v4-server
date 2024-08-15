import { Elysia, t } from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { readCharacter, updateCharacter } from "../database/queries";
import { UploadAssets } from "../database/queries/assetQueries";
import {
  GatewayMentionSearchSchema,
  GatewaySearchSchema,
  ListAssetsSchema,
  ListCharacterFieldsTemplateSchema,
  ReadCharacterSchema,
  UpdateCharacterSchema,
} from "../database/validation";
import { MessageEnum } from "../enums";
import { GatewayAccessType, GatewayConfigEntityTypes } from "../types/entityTypes";
import {
  GatewayResponseSchema,
  GatewayResponseWithDataSchema,
  ResponseWithDataSchema,
  SearchableEntities,
} from "../types/requestTypes";
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
            const gateway_access_data = JSON.parse(gateway_access) as GatewayAccessType;
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
        "/assets/:entity_type/:access_id",
        async ({ params, body }) => {
          const redis = await redisClient;

          const gateway_access = await redis.GET(`${params.entity_type}_gateway_access_${params.access_id}`);

          if (gateway_access) {
            try {
              const gateway_access_data = JSON.parse(gateway_access) as GatewayAccessType;

              const ids = gateway_access_data.config.images;

              if (ids.length) {
                const data = await db
                  .selectFrom("images")
                  .select(body.fields as SelectExpression<DB, "images">[])
                  .where("id", "in", ids)
                  .execute();

                return { data, ok: true, message: MessageEnum.success };
              }

              return { data: [], ok: false, message: "There was an error with this request." };
            } catch (error) {
              console.error(error);
              return { data: [], ok: false, message: "There was an error with this request." };
            }
          }
          return { data: [], ok: false, message: "There was an error with this request." };
        },
        { body: ListAssetsSchema, response: GatewayResponseWithDataSchema },
      )
      .post(
        "/options/:type",
        async ({ params, body }) => {
          const { type } = params;
          const redis = await redisClient;

          const gateway_access = await redis.GET(`${body.data.entity_type}_gateway_access_${body.data.access_id}`);
          if (gateway_access) {
            try {
              const gateway_access_data = JSON.parse(gateway_access) as GatewayAccessType;

              const entities = Object.entries(gateway_access_data?.config || {});
              const requests = [];
              for (let index = 0; index < entities.length; index++) {
                const entity = entities[index][0] as GatewayConfigEntityTypes;
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
                data: {
                  create_config: gateway_access_data.gateway_type === "create" ? gateway_access_data.create_config : undefined,
                  project_id: gateway_access_data.project_id,
                  entities: result.map((item) => ({
                    value: item.id,
                    label: item?.full_name || item.title,
                    parent_id: "parent_id" in item ? item?.parent_id : null,
                    image:
                      type === "characters" || (type === "nodes" && item?.first_name)
                        ? item.portrait_id || ""
                        : item?.image_id || "",
                    icon: item?.icon,
                    entity_type: item?.entity_type,
                  })),
                },
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
          body: GatewaySearchSchema,
          response: GatewayResponseWithDataSchema,
        },
      )
      .post(
        "/search/:type/mentions",
        async ({ params, body }) => {
          const { type } = params;
          const fields = ["id"];
          const redis = await redisClient;

          const gateway_access = await redis.GET(`${body.data.entity_type}_gateway_access_${body.data.access_id}`);

          if (gateway_access) {
            try {
              const gateway_access_data = JSON.parse(gateway_access) as GatewayAccessType;

              const ids =
                gateway_access_data.config[
                  params.type as
                    | "characters"
                    | "blueprint_instances"
                    | "documents"
                    | "maps"
                    | "map_pins"
                    | "events"
                    | "images"
                    | "random_tables"
                ];

              if (ids.length === 0) {
                return { data: [], ok: true, message: MessageEnum.success };
              }

              if (type === "characters") fields.push("full_name", "portrait_id");
              else fields.push("title");

              if (type === "characters") {
                let query = db
                  .selectFrom("characters")
                  .select(["characters.id", "characters.full_name", "characters.portrait_id", "characters.project_id"])
                  .where("full_name", "ilike", `%${body.data.search_term}%`)
                  .where("id", "in", ids)
                  .limit(10);

                const characters = await query.execute();

                const data = characters.map((char) => ({
                  id: char.id,
                  title: char.full_name,
                  portrait_id: char.portrait_id,
                  project_id: char.project_id,
                }));
                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }

              if (type === "documents") {
                let document_query = db
                  .selectFrom("documents")
                  .select(["documents.id", "documents.title", "documents.project_id"])
                  .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10);

                const documents = await document_query.execute();

                return {
                  data: documents,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "maps") {
                let query = db
                  .selectFrom("maps")
                  .select(["maps.id", "maps.title", "maps.image_id", "maps.project_id"])
                  .where("maps.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10);

                const data = await query.execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "map_pins") {
                const data = await db
                  .selectFrom("map_pins")
                  .leftJoin("maps", "maps.id", "map_pins.parent_id")
                  .select(["map_pins.id", "map_pins.title", "map_pins.parent_id", "map_pins.image_id", "maps.project_id"])
                  .where("map_pins.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10)
                  .execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "graphs") {
                let query = db
                  .selectFrom("graphs")
                  .select(["graphs.id", "graphs.title", "graphs.project_id"])
                  .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10);

                const data = await query.execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "words") {
                const data = await db
                  .selectFrom("words")
                  .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
                  .select(["words.id", "words.title", "dictionaries.project_id"])
                  .where("words.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10)
                  .execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "events") {
                const data = await db
                  .selectFrom("events")
                  .leftJoin("calendars", "calendars.id", "events.parent_id")
                  .select(["events.id", "events.title", "events.parent_id", "calendars.project_id"])
                  .where("events.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10)
                  .execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
              if (type === "blueprint_instances") {
                let query = db
                  .selectFrom("blueprint_instances")
                  .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                  .select([
                    "blueprint_instances.id",
                    "blueprint_instances.title",
                    "blueprints.icon",
                    "blueprint_instances.parent_id",
                    "blueprints.project_id",
                  ])
                  .where("blueprint_instances.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
                  .where("id", "in", ids)
                  .limit(10);

                const data = await query.execute();

                return {
                  data,
                  message: MessageEnum.success,
                  ok: true,
                  role_access: true,
                };
              }
            } catch (error) {
              console.error(error);
              return {
                data: [],
                message: MessageEnum.success,
                ok: true,
                role_access: true,
              };
            }
            return {
              data: [],
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          }
          return {
            data: [],
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        {
          response: GatewayResponseWithDataSchema,
          body: GatewayMentionSearchSchema,
        },
      ),
  );
}
