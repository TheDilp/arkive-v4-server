import Elysia from "elysia";
import { ExpressionBuilder, ReferenceExpression, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission } from "../database/queries";
import { DBKeys, EntitiesWithTags } from "../database/types";
import { BasicSearchSchema, CategorySearchSchema, TagSearchSchema } from "../database/validation/search";
import { EntitiesWithPermissionsEnum, EntitiesWithTagsTablesEnum, SubEntityEnum } from "../enums/entityEnums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler } from "../handlers";
import { AvailablePermissions, EntitiesWithFolders, EntitiesWithPermissionCheck } from "../types/entityTypes";
import { PermissionDecorationType, ResponseWithDataSchema, SearchableEntities } from "../types/requestTypes";
import { getSearchTableFromType } from "../utils/requestUtils";

function getSearchFields(type: SearchableEntities): string[] {
  const fields = type === "map_images" ? ["images.id"] : [`${type}.id`];
  if (type === "characters") fields.push("full_name", "nickname", "portrait_id");
  else if (type === "tags") fields.push("title", "color");
  else if (type === "nodes") fields.push("label", "nodes.parent_id", "nodes.image_id");
  else if (type === "edges") fields.push("label", "edges.parent_id");
  else if (type === "map_images") fields.push("images.title");
  else fields.push(`${type}.title`);

  if (type === "documents") fields.push("documents.image_id");
  if (type === "maps") fields.push("maps.image_id");
  if (type === "events") fields.push("events.parent_id");
  if (type === "map_pins") fields.push("map_pins.parent_id", "map_pins.icon", "map_pins.image_id");
  if (type === "words") fields.push("words.parent_id");
  if (type === "blueprint_instances") fields.push("blueprint_instances.parent_id");

  return fields;
}

function getSearchWhere(
  eb: ExpressionBuilder<DB, keyof DB>,
  type: SearchableEntities,
  search_term: string,
  project_id: string,
) {
  if (type === "characters") {
    return eb.or([eb("full_name", "ilike", `%${search_term}%`), eb("nickname", "ilike", `%${search_term}%`)]);
  }
  if (type === "edges") {
    return eb.and([eb("label", "ilike", `%${search_term}%`), eb("graphs.project_id", "=", project_id)]);
  }
  if (type === "nodes") {
    return eb.and([
      eb.or([eb("nodes.label", "ilike", `%${search_term}%`), eb("characters.first_name", "ilike", `%${search_term}%`)]),
      eb("graphs.project_id", "=", project_id),
    ]);
  }
  if (type === "map_images") {
    return eb.and([eb("images.title", "ilike", `%${search_term}%`), eb("images.type", "=", "map_images")]);
  }
  return eb(`${type}.title`, "ilike", `%${search_term}%`);
}

export function search_router(app: Elysia) {
  return app.group("/search", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
      } as PermissionDecorationType)
      .post(
        "/:project_id/:type/folder",
        async ({ params, body }) => {
          const { project_id, type } = params;

          const result = await db
            .selectFrom(`${type as EntitiesWithFolders}`)
            .select(["id", "title", "parent_id", "is_folder"])
            .where("project_id", "=", project_id)
            .where("is_folder", "=", true)
            .where("title", "ilike", `%${body.data.search_term}%`)

            .limit(body.limit || 10)
            .execute();

          return {
            data: result.map((item) => ({
              value: item.id,
              label: item?.title,
              parent_id: item?.parent_id || null,
            })),
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        { body: BasicSearchSchema },
      )
      .post(
        "/:project_id/:type",
        async ({ params, body, permissions }) => {
          const { project_id, type } = params;

          if (type === "documents_content") {
            const data = await db
              .selectFrom("documents")
              .select(["id", "title", "icon", "image_id"])
              .where(
                sql`to_tsvector(${sql.ref("content")})`,
                "@@",
                sql<string>`to_tsquery(${sql.lit("english")}, ${body.data.search_term})`,
              )
              .limit(25)
              .execute();
            return {
              data: data.map((item) => ({
                value: item.id,
                label: item?.title,
                image: item?.image_id,
                icon: item?.icon,
              })),
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          }

          const fields = getSearchFields(type as SearchableEntities);

          if (type === "places") {
            const maps = await db
              .selectFrom("maps")
              .select(["maps.id", "maps.title", "maps.image_id", "maps.project_id", "maps.icon"])
              .where("maps.project_id", "=", project_id)
              .where("maps.title", "ilike", `%${body.data.search_term}%`)
              .execute();
            const map_pins = await db
              .selectFrom("map_pins")
              .leftJoin("maps", (join) =>
                join.onRef("maps.project_id", "=", "map_pins.parent_id").on("maps.project_id", "=", project_id),
              )
              .select(["map_pins.id", "map_pins.title", "map_pins.image_id", "map_pins.parent_id", "map_pins.icon"])
              .where("map_pins.character_id", "is", null)
              .where("map_pins.title", "ilike", `%${body.data.search_term}%`)
              .execute();

            const result = [...maps, ...map_pins];

            return {
              data: result.map((item) => ({
                value: item.id,
                label: item?.title,
                parent_id: "parent_id" in item ? item?.parent_id : null,
                image: item?.image_id,
                icon: item?.icon,
              })),
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          }

          let query = db
            .selectFrom(getSearchTableFromType(type as SearchableEntities | keyof DB))
            // @ts-ignore
            .select(fields as SelectExpression<DB, SearchableEntities>[]);

          if (type === "nodes") {
            query = query
              .leftJoin("characters", "characters.id", "nodes.character_id")
              .leftJoin("graphs", "graphs.id", "nodes.parent_id")
              .select([
                "graphs.title as parent_title",
                "characters.id as character_id",
                "characters.full_name",
                "characters.portrait_id",
              ]);
          } else if (type === "edges") {
            query = query.leftJoin("graphs", "graphs.id", "nodes.parent_id").select(["graphs.title as parent_title"]);
          } else if (type === "map_pins") {
            query = query.leftJoin("maps", "maps.id", "map_pins.parent_id").select(["maps.title as parent_title"]);
          } else if (type === "events") {
            query = query.leftJoin("calendars", "calendars.id", "events.parent_id").select(["calendars.title as parent_title"]);
          } else if (type === "words") {
            query = query
              .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
              .select(["dictionaries.title as parent_title"]);
          } else if (type === "blueprint_instances") {
            query = query
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .select(["blueprints.icon as icon"]);
          } else if (type === "images") {
            query = query.where("type", "=", "images");
          }

          if (body.data.parent_id) {
            query = query.where(`${type}.parent_id` as ReferenceExpression<DB, DBKeys>, "=", body.data.parent_id || "");
          }

          query = query.where((eb) => getSearchWhere(eb, type as SearchableEntities, body.data.search_term, params.project_id));

          if (!SubEntityEnum.includes(type) || type === "alter_names") {
            query = query.where("project_id", "=", params.project_id);
          }

          if (EntitiesWithPermissionsEnum.includes(type as EntitiesWithPermissionCheck) && !permissions.is_project_owner) {
            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, type as EntitiesWithPermissionCheck);
            }
          }

          query = query.limit(body.limit || 10);
          const result = await query.execute();

          return {
            data: result.map((item) => ({
              value: item.id,
              label:
                type === "characters" || (type === "nodes" && item?.first_name)
                  ? item.full_name
                  : item?.title || item?.label || "",
              color: type === "tags" ? item.color : "",
              image:
                type === "characters" || (type === "nodes" && item?.first_name) ? item.portrait_id || "" : item?.image_id || "",
              parent_id: item?.parent_id || null,
              parent_title: item?.parent_title,
              first_name: item?.first_name,
              last_name: item?.last_name,
              icon: item?.icon,
            })),
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        {
          response: ResponseWithDataSchema,
          body: BasicSearchSchema,
          beforeHandle: async (context) =>
            beforeRoleHandler(
              context,
              `read_${context.params.type === "images" ? "assets" : context.params.type}` as AvailablePermissions,
            ),
        },
      )
      .post(
        "/:project_id/:type/mentions",
        async ({ params, body, permissions }) => {
          const { type } = params;
          const fields = ["id"];

          const userPermissionsQuery = db
            .selectFrom("user_roles")
            .leftJoin("role_permissions", "role_permissions.role_id", "user_roles.role_id")
            .leftJoin("permissions", "permissions.id", "role_permissions.permission_id")
            .where("user_roles.project_id", "=", params.project_id)
            .where("user_roles.user_id", "=", permissions.user_id)
            .where("permissions.code", "like", `read_${type}`)
            .select(["permissions.code", "permissions.id"]);

          const permissionsForSearch = permissions.is_project_owner || (await userPermissionsQuery.executeTakeFirst());

          if (type === "characters") fields.push("full_name", "portrait_id");
          else fields.push("title");

          if (type === "characters") {
            let query = db
              .selectFrom("characters")
              .select(["characters.id", "characters.full_name", "characters.portrait_id"])
              .where("full_name", "ilike", `%${body.data.search_term}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10);
            if (typeof permissionsForSearch !== "boolean") {
              query = checkEntityLevelPermission(
                query,
                { ...permissions, permission_id: permissionsForSearch?.id || null },
                "characters",
              );
            }

            const characters = await query.execute();

            const data = characters.map((char) => ({
              id: char.id,
              title: char.full_name,
              portrait_id: char.portrait_id,
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
              .select(["documents.id", "documents.title"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10);

            if (typeof permissionsForSearch !== "boolean") {
              document_query = checkEntityLevelPermission(
                document_query,
                { ...permissions, permission_id: permissionsForSearch?.id || null },
                "documents",
              );
            }

            const documents = await document_query.execute();

            const alter_names = await db
              .selectFrom("alter_names")
              .select(["alter_names.id as alterId", "alter_names.title", "alter_names.parent_id"])
              .where("alter_names.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("alter_names.project_id", "=", params.project_id)
              .limit(body.limit || 10)
              .execute();

            const combinedResult = [...documents, ...alter_names];
            return {
              data: combinedResult,
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          }
          if (type === "maps") {
            let query = db
              .selectFrom("maps")
              .select(["maps.id", "maps.title", "maps.image_id"])
              .where("maps.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("maps.project_id", "=", params.project_id)
              .limit(body.limit || 10);

            if (typeof permissionsForSearch !== "boolean") {
              query = checkEntityLevelPermission(
                query,
                { ...permissions, permission_id: permissionsForSearch?.id || null },
                "maps",
              );
            }
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
              .select(["map_pins.id", "map_pins.title", "map_pins.parent_id", "map_pins.image_id"])
              .where("map_pins.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("maps.project_id", "=", params.project_id)
              .limit(body.limit || 10)
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
              .select(["graphs.id", "graphs.title"])
              .where("title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .where("project_id", "=", params.project_id)
              .limit(body.limit || 10);

            if (typeof permissionsForSearch !== "boolean") {
              query = checkEntityLevelPermission(
                query,
                { ...permissions, permission_id: permissionsForSearch?.id || null },
                "graphs",
              );
            }

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
              role_access: true,
            };
          }
          if (type === "events") {
            const data = await db
              .selectFrom("events")
              .select(["events.id", "events.title", "events.parent_id"])
              .leftJoin("calendars", "calendars.id", "events.parent_id")
              .where("calendars.project_id", "=", params.project_id)
              .where("events.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .limit(body.limit || 10)
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
              ])
              .where("blueprints.project_id", "=", params.project_id)
              .where("blueprint_instances.title", "ilike", `%${body.data.search_term.toLowerCase()}%`)
              .limit(body.limit || 10);

            if (typeof permissionsForSearch !== "boolean") {
              query = checkEntityLevelPermission(
                query,
                { ...permissions, permission_id: permissionsForSearch?.id || null },
                "blueprint_instances",
              );
            }

            const data = await query.execute();

            return {
              data,
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
          body: CategorySearchSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, undefined, true),
        },
      )
      .post(
        "/:project_id",
        async ({ params, body, permissions }) => {
          const { project_id } = params;
          const { search_term } = body.data;

          const userPermissionsQuery = db
            .selectFrom("user_roles")
            .leftJoin("role_permissions", "role_permissions.role_id", "user_roles.role_id")
            .leftJoin("permissions", "permissions.id", "role_permissions.permission_id")
            .where("user_roles.project_id", "=", project_id)
            .where("user_roles.user_id", "=", permissions.user_id)
            .where("permissions.code", "like", "read_%")
            .select(["permissions.code", "permissions.id"]);

          const charactersSearch = {
            name: "characters",
            request: db
              .selectFrom("characters")
              .select(["characters.id", "characters.full_name", "characters.portrait_id"])
              .where("characters.full_name", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const documentSearch = {
            name: "documents",
            request: db
              .selectFrom("documents")
              .select(["documents.id", "documents.title", "documents.icon"])
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
              .select(["maps.id", "maps.title", "maps.image_id"])
              .where("maps.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const mapPinSearch = {
            name: "map_pins",
            request: db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .select(["map_pins.id", "map_pins.title", "map_pins.icon", "map_pins.parent_id", "maps.title as parent_title"])
              .where("map_pins.title", "is not", null)
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
              .where("characters.full_name", "ilike", `%${search_term}%`)
              .select([
                "map_pins.id",
                "map_pins.icon",
                "map_pins.parent_id",
                "maps.title as parent_title",
                "characters.full_name as title",
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
              .select(["graphs.id", "graphs.title", "graphs.icon"])
              .limit(5),
          };
          const nodeSearch = {
            name: "nodes",
            request: db
              .selectFrom("nodes")
              .leftJoin("graphs", "graphs.id", "nodes.parent_id")
              .leftJoin("characters", "characters.id", "nodes.character_id")
              .where((eb) =>
                eb.or([eb("label", "ilike", `%${search_term}%`), eb("characters.first_name", "ilike", `%${search_term}%`)]),
              )
              .where("graphs.project_id", "=", project_id)
              .select([
                "nodes.id",
                "nodes.label",
                "nodes.parent_id",
                "nodes.image_id",
                "graphs.title as parent_title",
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
              .leftJoin("graphs", "graphs.id", "edges.parent_id")
              .where("graphs.project_id", "=", project_id)
              .select(["edges.id", "edges.label", "edges.parent_id", "graphs.title as parent_title"])
              .limit(5),
          };
          const calendarSearch = {
            name: "calendars",
            request: db
              .selectFrom("calendars")
              .where("calendars.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["calendars.id", "calendars.title", "calendars.icon"])
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

          const dictionariesSearch = {
            name: "dictionaries",
            request: db
              .selectFrom("dictionaries")
              .where("dictionaries.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["dictionaries.id", "dictionaries.title"])
              .limit(5),
          };
          const wordsSearch = {
            name: "words",
            request: db
              .selectFrom("words")
              .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
              .where("words.title", "ilike", `%${search_term}%`)
              .where("dictionaries.project_id", "=", project_id)
              .select(["words.id", "words.title", "words.parent_id"])
              .limit(5),
          };

          const blueprintsSearch = {
            name: "blueprints",
            request: db
              .selectFrom("blueprints")
              .where("blueprints.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["blueprints.id", "blueprints.title", "blueprints.icon"])
              .limit(5),
          };
          const blueprintInstancesSearch = {
            name: "blueprint_instances",
            request: db
              .selectFrom("blueprint_instances")
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprint_instances.title", "ilike", `%${search_term}%`)
              .where("blueprints.project_id", "=", project_id)
              .select([
                "blueprint_instances.id",
                "blueprint_instances.title",
                "blueprints.title as parent_title",
                "blueprint_instances.parent_id",
                "blueprints.icon",
              ])
              .limit(5),
          };

          const permissionsForSearch = permissions.is_project_owner || (await userPermissionsQuery.execute());
          const formattedPermissions: Partial<Record<EntitiesWithPermissionCheck, string>> = {};

          const requests =
            permissionsForSearch === true
              ? [
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
                  dictionariesSearch,
                  wordsSearch,
                  blueprintsSearch,
                  blueprintInstancesSearch,
                ]
              : [];
          if (permissionsForSearch !== true && typeof permissionsForSearch !== "boolean") {
            permissionsForSearch.forEach((perm) => {
              if (perm.code && perm.id) {
                const entity = perm.code.replace("read_", "") as EntitiesWithPermissionCheck;
                formattedPermissions[entity] = perm.id;
              }
            });

            if (formattedPermissions.characters) {
              requests.push(charactersSearch);
            }
            if (formattedPermissions.blueprints) {
              requests.push(blueprintsSearch);
            }
            if (formattedPermissions.blueprint_instances) {
              requests.push(blueprintInstancesSearch);
            }
            if (formattedPermissions.documents) {
              requests.push(documentSearch, alterNameSearch);
            }
            if (formattedPermissions.maps) {
              requests.push(mapSearch, mapPinSearch, characterMapPinSearch);
            }
            if (formattedPermissions.graphs) {
              requests.push(graphSearch, nodeSearch, edgeSearch);
            }
            if (formattedPermissions.dictionaries) {
              requests.push(dictionariesSearch, wordsSearch);
            }
            if (formattedPermissions.calendars) {
              requests.push(calendarSearch, eventsSearch);
            }
          }

          const result = await Promise.all(
            requests.map(async (item) => {
              if (
                EntitiesWithPermissionsEnum.includes(item.name as EntitiesWithPermissionCheck) &&
                !permissions.is_project_owner
              ) {
                item.request = checkEntityLevelPermission(
                  item.request,
                  { ...permissions, permission_id: formattedPermissions[item.name as EntitiesWithPermissionCheck] || null },
                  item.name as EntitiesWithPermissionCheck,
                );
              }

              return {
                name: item.name,
                result: await item.request.execute(),
              };
            }),
          );

          return { data: result, ok: true, role_access: true, message: MessageEnum.success };
        },
        {
          body: BasicSearchSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, undefined, true),
        },
      )
      .post(
        "/:project_id/all/tags",
        async ({ params, body, permissions }) => {
          const userPermissionsQuery = db
            .selectFrom("user_roles")
            .leftJoin("role_permissions", "role_permissions.role_id", "user_roles.role_id")
            .leftJoin("permissions", "permissions.id", "role_permissions.permission_id")
            .where("user_roles.project_id", "=", params.project_id)
            .where("user_roles.user_id", "=", permissions.user_id)
            .where("permissions.code", "like", "read_%")
            .select(["permissions.code", "permissions.id"]);

          const permissionsForSearch = permissions.is_project_owner || (await userPermissionsQuery.execute());
          const formattedPermissions: Partial<Record<EntitiesWithPermissionCheck, string>> = {};

          if (permissionsForSearch !== true && typeof permissionsForSearch !== "boolean") {
            permissionsForSearch.forEach((perm) => {
              if (perm.code && perm.id) {
                const entity = perm.code.replace("read_", "") as EntitiesWithPermissionCheck;
                formattedPermissions[entity] = perm.id;
              }
            });
          }

          const { tag_ids = [], match = "any" } = body.data;
          if (tag_ids.length) {
            const requests = EntitiesWithTagsTablesEnum.filter((tb) => {
              const entity_name = tb.replace("_", "").replace("Totags", "") as EntitiesWithPermissionCheck | "nodes" | "edges";
              if (permissionsForSearch === true) return true;
              if (entity_name === "graphs" || entity_name === "nodes" || entity_name === "edges")
                return !!formattedPermissions.graphs;
              return !!formattedPermissions[entity_name];
            }).map((tb) => {
              const entity_name = tb.replace("_", "").replace("Totags", "") as EntitiesWithTags;

              const fields = [`${entity_name}.id`];

              if (entity_name === "characters") fields.push("characters.full_name", "characters.portrait_id");
              else if (entity_name === "nodes" || entity_name === "edges") fields.push("label");
              else fields.push(`${entity_name}.title`);
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
                        .where(`${tb}.B`, "in", tag_ids)
                        .groupBy(`${entity_name}.id`)
                        .having(sql`count(distinct tags.id)`, "=", tag_ids.length),
              };
            });
            const result = await Promise.all(
              requests.map(async (item) => {
                if (
                  EntitiesWithPermissionsEnum.includes(item.name as EntitiesWithPermissionCheck) &&
                  !permissions.is_project_owner
                ) {
                  item.request = checkEntityLevelPermission(
                    item.request,
                    { ...permissions, permission_id: formattedPermissions[item.name as EntitiesWithPermissionCheck] || null },
                    item.name as EntitiesWithPermissionCheck,
                  );
                }
                return {
                  name: item.name,
                  result: await item.request.execute(),
                };
              }),
            );

            return { data: result, ok: true, role_access: true, message: MessageEnum.success };
          }
          return { data: [], message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: TagSearchSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, undefined, true),
        },
      ),
  );
}
