import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  BasicSearchSchema,
  EntityListSchema,
  ReadCalendarSchema,
  ReadDictionarySchema,
  ReadDocumentSchema,
  ReadGraphSchema,
  ReadMapSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";

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
        "/documents/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("documents")
            .where("id", "=", params.id)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "documents">[]))
            .executeTakeFirstOrThrow();
          if (data.is_public) return { data, message: MessageEnum.success, ok: true };

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
            .executeTakeFirstOrThrow();

          if (data.is_public) return { data, message: MessageEnum.success, ok: true };
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

            .select([
              "graphs.id",
              "graphs.title",
              "graphs.icon",
              "graphs.is_public",
              "graphs.default_node_shape",
              "graphs.default_node_color",
              "graphs.default_edge_color",
            ])
            .executeTakeFirstOrThrow();
          const edges = body?.relations?.edges
            ? await db.selectFrom("edges").selectAll().where("edges.parent_id", "=", params.id).execute()
            : [];

          const finalData: typeof data & { parents?: any[]; edges?: any[] } = { ...data };

          if (edges.length) {
            finalData.edges = edges;
          }
          if (data.is_public)
            return {
              data: finalData,
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
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
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

            .executeTakeFirstOrThrow();
          if (data?.is_public) return { data, message: MessageEnum.success, ok: true };
          return { data: { is_public: false }, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDictionarySchema,
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

          const requests = [charactersSearch, documentSearch, mapSearch, graphSearch, blueprintInstancesSearch];
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
