import Elysia from "elysia";
import { ExpressionBuilder, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithTags } from "../database/types";
import { BasicSearchSchema, CategorySearchSchema, TagSearchSchema } from "../database/validation/search";
import { EntitiesWithoutProjectId, EntitiesWithTagsTables, SubEntityEnum } from "../enums/entityEnums";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseWithDataSchema, SearchableEntities } from "../types/requestTypes";
import { getSearchTableFromType } from "../utils/requestUtils";
import { getCharacterFullName } from "../utils/transform";

function getSearchFields(type: SearchableEntities): string[] {
  const fields = [`${type}.id`];
  if (type === "characters") fields.push("first_name", "nickname", "last_name", "portrait_id");
  else if (type === "tags") fields.push("title", "color");
  else if (type === "nodes") fields.push("label", "nodes.parent_id", "nodes.image_id");
  else if (type === "edges") fields.push("label", "edges.parent_id");
  else fields.push(`${type}.title`);

  if (type === "events") fields.push("events.parent_id");
  if (type === "map_pins") fields.push("map_pins.parent_id");
  if (type === "words") fields.push("words.parent_id");

  return fields;
}

function getSearchWhere(eb: ExpressionBuilder<DB, keyof DB>, type: SearchableEntities, search_term: string) {
  if (type === "characters") {
    return eb.or([
      eb("first_name", "ilike", `%${search_term}%`),
      eb("nickname", "ilike", `%${search_term}%`),
      eb("last_name", "ilike", `%${search_term}%`),
    ]);
  }
  if (type === "edges") {
    return eb("label", "ilike", `%${search_term}%`);
  }
  if (type === "nodes") {
    return eb.or([eb("nodes.label", "ilike", `%${search_term}%`), eb("characters.first_name", "ilike", `%${search_term}%`)]);
  }
  return eb(`${type}.title`, "ilike", `%${search_term}%`);
}

export function search_router(app: Elysia) {
  return app.group("/search", (server) =>
    server
      .post(
        "/:project_id/:type",
        async ({ params, body }) => {
          const { type } = params;
          const fields = getSearchFields(type as SearchableEntities);

          const result = await db
            .selectFrom(getSearchTableFromType(type as "map_images" | keyof DB))
            .select(fields as SelectExpression<DB, SearchableEntities>[])
            .$if(type === "nodes", (eb) =>
              eb
                .leftJoin("characters", "characters.id", "nodes.character_id")
                .leftJoin("boards", "boards.id", "nodes.parent_id")
                .select([
                  "boards.title as parent_title",
                  "characters.id as character_id",
                  "characters.first_name",
                  "characters.last_name",
                  "characters.portrait_id",
                ]),
            )
            .$if(type === "edges", (eb) =>
              eb.leftJoin("boards", "boards.id", "nodes.parent_id").select(["boards.title as parent_title"]),
            )
            .$if(type === "map_pins", (eb) =>
              eb.leftJoin("maps", "maps.id", "map_pins.parent_id").select(["maps.title as parent_title"]),
            )
            .$if(type === "events", (eb) =>
              eb.leftJoin("calendars", "calendars.id", "events.parent_id").select(["calendars.title as parent_title"]),
            )
            .$if(type === "words", (eb) =>
              eb.leftJoin("dictionaries", "dictionaries.id", "words.parent_id").select(["dictionaries.title as parent_title"]),
            )
            .$if(!EntitiesWithoutProjectId.includes(type), (eb) => eb.where("project_id", "=", params.project_id))
            .$if(type === "map_images", (eb) => eb.where("type", "=", "map_image"))
            .$if(type === "images", (eb) => eb.where("type", "=", "images"))
            .where((eb) => getSearchWhere(eb, type as SearchableEntities, body.data.search_term))

            .execute();
          return {
            data: result.map((item) => ({
              value: item.id,
              label:
                type === "characters" || (type === "nodes" && item?.first_name)
                  ? `${item.first_name} ${item?.last_name || ""}`
                  : item?.title || item?.label || "",
              color: type === "tags" ? item.color : "",
              image:
                type === "characters" || (type === "nodes" && item?.first_name) ? item.portrait_id || "" : item?.image_id || "",
              parent_id: item?.parent_id || null,
              parent_title: item?.parent_title,
            })),
            message: MessageEnum.success,
            ok: true,
          };
        },
        { body: BasicSearchSchema },
      )
      .post(
        "/:project_id/:type/mentions",
        async ({ params, body }) => {
          const { type } = params;
          const fields = ["id"];

          if (type === "characters") fields.push("first_name", "nickname", "last_name", "portrait_id");
          else fields.push("title");

          if (type === "characters") {
            const characters = await db
              .selectFrom("characters")
              .select(["id", "first_name", "last_name", "portrait_id"])
              .where((wb) =>
                wb.or([
                  wb("first_name", "ilike", `%${body.data.search_term.toLowerCase()}%`),
                  wb("last_name", "ilike", `%${body.data.search_term.toLowerCase()}%`),
                ]),
              )
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();
            const data = characters.map((char) => ({
              id: char.id,
              title: getCharacterFullName(char.first_name, undefined, char.last_name),
              portrait_id: char.portrait_id,
            }));
            return {
              data,
              message: MessageEnum.success,
              ok: true,
            };
          }

          if (type === "documents") {
            const documents = await db
              .selectFrom("documents")
              .select(["id", "title"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();
            const alter_names = await db
              .selectFrom("alter_names")
              .select(["id as alterId", "title", "parent_id"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();

            const combinedResult = [...documents, ...alter_names];
            return {
              data: combinedResult,
              message: MessageEnum.success,
              ok: true,
            };
          }

          if (type === "maps") {
            const data = await db
              .selectFrom("maps")
              .select(["id", "title"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();

            return {
              data,
              message: MessageEnum.success,
              ok: true,
            };
          }
          if (type === "boards") {
            const data = await db
              .selectFrom("boards")
              .select(["id", "title"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();

            return {
              data,
              message: MessageEnum.success,
              ok: true,
            };
          }
          if (type === "words") {
            const data = await db
              .selectFrom("words")
              .select(["words.id", "words.title"])
              .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
              .where("dictionaries.project_id", "=", params.project_id)
              .where("words.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .limit(body.limit || 10)
              .execute();

            return {
              data,
              message: MessageEnum.success,
              ok: true,
            };
          }
          return {
            data: [],
            message: MessageEnum.success,
            ok: true,
          };
        },
        {
          body: CategorySearchSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:project_id",
        async ({ params, body }) => {
          const { project_id } = params;
          const { search_term } = body.data;

          const charactersSearch = {
            name: "characters",
            request: db
              .selectFrom("characters")
              .select(["id", "first_name", "last_name", "portrait_id"])
              .where((eb) =>
                eb.or([
                  eb("characters.first_name", "ilike", `%${search_term}%`),
                  eb("characters.last_name", "ilike", `%${search_term}%`),
                ]),
              )
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const documentSearch = {
            name: "documents",
            request: db
              .selectFrom("documents")
              .select(["id", "title", "icon"])
              .where("documents.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const alterNameSearch = {
            name: "alter_names",
            request: db
              .selectFrom("alter_names")
              .select(["id", "title", "parent_id"])
              .select(["id as alterId", "alter_names.title", "parent_id"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const mapSearch = {
            name: "maps",
            request: db
              .selectFrom("maps")
              .select(["id", "title"])
              .where("maps.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const mapPinSearch = {
            name: "map_pins",
            request: db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .select(["map_pins.id", "map_pins.icon", "map_pins.parent_id", "maps.title as parent_title"])
              .where("map_pins.title", "ilike", `%${search_term}%`)
              .limit(5),
          };
          const characterMapPinSearch = {
            name: "character_map_pins",
            request: db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .where("map_pins.character_id", "is not", null)
              .leftJoin("characters", "characters.id", "map_pins.character_id")
              .where((eb) =>
                eb.or([
                  eb("characters.first_name", "ilike", `%${search_term}%`),
                  eb("characters.last_name", "ilike", `%${search_term}%`),
                ]),
              )
              .select([
                "map_pins.id",
                "map_pins.icon",
                "map_pins.parent_id",
                "maps.title as parent_title",
                "characters.first_name",
                "characters.last_name",
                "characters.portrait_id",
              ])
              .limit(5),
          };
          const graphSearch = {
            name: "boards",
            request: db
              .selectFrom("boards")
              .where("boards.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["id", "title", "icon"])
              .limit(5),
          };
          const nodeSearch = {
            name: "nodes",
            request: db
              .selectFrom("nodes")
              .leftJoin("boards", "boards.id", "nodes.parent_id")
              .leftJoin("characters", "characters.id", "nodes.character_id")
              .where((eb) =>
                eb.or([eb("label", "ilike", `%${search_term}%`), eb("characters.first_name", "ilike", `%${search_term}%`)]),
              )
              .where("boards.project_id", "=", project_id)
              .select([
                "nodes.id",
                "nodes.label",
                "nodes.parent_id",
                "nodes.image_id",
                "boards.title as parent_title",
                "characters.first_name",
                "characters.last_name",
                "characters.portrait_id",
              ])
              .limit(5),
          };
          const edgeSearch = {
            name: "edges",
            request: db
              .selectFrom("edges")
              .where("label", "ilike", `%${search_term}%`)
              .leftJoin("boards", "boards.id", "edges.parent_id")
              .where("boards.project_id", "=", project_id)
              .select(["edges.id", "edges.label", "edges.parent_id", "boards.title as parent_title"])
              .limit(5),
          };
          const calendarSearch = {
            name: "calendars",
            request: db
              .selectFrom("calendars")
              .where("calendars.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["id", "title", "icon"])
              .limit(5),
          };
          const eventsSearch = {
            name: "events",
            request: db
              .selectFrom("events")
              .leftJoin("calendars", "calendars.id", "events.parent_id")
              .where("events.title", "ilike", `%${search_term}%`)
              .where("calendars.project_id", "=", project_id)
              .select(["events.id", "events.title", "calendars.title as parent_title", "events.parent_id"])
              .limit(5),
          };
          const requests = [
            charactersSearch,
            documentSearch,
            alterNameSearch,
            mapSearch,
            characterMapPinSearch,
            mapPinSearch,
            graphSearch,
            nodeSearch,
            edgeSearch,
            calendarSearch,
            eventsSearch,
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
      )
      .post(
        "/:project_id/all/tags",
        async ({ body }) => {
          const { tag_ids = [], match = "any" } = body.data;
          if (tag_ids.length) {
            const requests = EntitiesWithTagsTables.map((tb) => {
              const entity_name = tb.replace("_", "").replace("Totags", "") as EntitiesWithTags;

              const fields = [`${entity_name}.id`];

              if (entity_name === "characters")
                fields.push("characters.first_name", "characters.last_name", "characters.portrait_id");
              else if (entity_name === "nodes" || entity_name === "edges") fields.push("label");
              else if (entity_name !== "cards") fields.push(`${entity_name}.title`);
              if (SubEntityEnum.includes(entity_name)) fields.push("parent_id");

              return {
                name: entity_name,
                request:
                  match === "any"
                    ? db
                        .selectFrom(tb)
                        .where(`${tb}.B`, "in", tag_ids)
                        .leftJoin(entity_name, `${entity_name}.id`, `${tb}.A`)
                        // @ts-ignore
                        .select(fields as SelectExpression<DB, SearchableEntities>[])
                        .distinctOn("id")
                    : db
                        .selectFrom(entity_name)
                        // @ts-ignore
                        .select(fields as SelectExpression<DB, SearchableEntities>[])
                        .leftJoin(tb, `${entity_name}.id`, `${tb}.A`)
                        // @ts-ignore
                        .leftJoin("tags", "tags.id", `${tb}.B`)
                        // @ts-ignore
                        .where("tags.id", "in", tag_ids)
                        .groupBy(`${entity_name}.id`)
                        .having(sql`count(distinct tags.id)`, "=", tag_ids.length),
              };
            });

            const result = await Promise.all(
              requests.map(async (item) => ({
                name: item.name,
                result: await item.request.execute(),
              })),
            );

            return { data: result, ok: true, message: MessageEnum.success };
          }
          return { data: [], message: MessageEnum.success, ok: true };
        },
        {
          body: TagSearchSchema,
          response: ResponseWithDataSchema,
        },
      ),
  );
}
