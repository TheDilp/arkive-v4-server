import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

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
            .where("characters.is_public", "=", true)
            .executeTakeFirst();
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
              .where("map_pins.character_id", "is not", null)
              .leftJoin("characters", "characters.id", "map_pins.character_id")
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
