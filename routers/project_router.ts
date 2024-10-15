import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { getAllProjectTags } from "../database/queries";
import { AssignRoleSchema } from "../database/validation";
import { DashboardSchema, InsertProjectSchema, ReadProjectSchema, UpdateProjectSchema } from "../database/validation/projects";
import { DefaultProjectFeatureFlags } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { PermissionDecorationType, RequestBodySchema, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { redisClient } from "../utils/redisClient";
import { getEntityWithOwnerId } from "../utils/utils";
import { sendNotification } from "../utils/websocketUtils";

export function project_router(app: Elysia) {
  return app.group("/projects", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
      } as PermissionDecorationType)
      .post(
        "/create",
        async ({ body, permissions }) => {
          await db.transaction().execute(async (tx) => {
            const project = await tx
              .insertInto("projects")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirst();
            if (project) {
              await tx
                .insertInto("user_project_feature_flags")
                .values({
                  project_id: project?.id,
                  user_id: permissions.user_id,
                  feature_flags: JSON.stringify(DefaultProjectFeatureFlags),
                })
                .execute();
            }
          });
          return { message: `Project ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertProjectSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ permissions }) => {
          const data = await db
            .selectFrom("projects")
            .leftJoin("users", "users.id", "projects.owner_id")
            .leftJoin("user_project_feature_flags", (join) =>
              join
                .on("user_project_feature_flags.user_id", "=", permissions.user_id)
                .onRef("user_project_feature_flags.project_id", "=", "projects.id"),
            )
            .select(["projects.id", "projects.title", "projects.image_id", "user_project_feature_flags.feature_flags"])
            .where("projects.owner_id", "=", permissions.user_id)
            .union(
              db
                .selectFrom("projects")
                .leftJoin("_project_members", "projects.id", "_project_members.A")
                .leftJoin("user_project_feature_flags", (join) =>
                  join
                    .on("user_project_feature_flags.user_id", "=", permissions.user_id)
                    .onRef("user_project_feature_flags.project_id", "=", "projects.id"),
                )
                .select(["projects.id", "projects.title", "projects.image_id", "user_project_feature_flags.feature_flags"])
                .where("_project_members.B", "=", (eb) =>
                  eb.selectFrom("users").select("users.id").where("users.id", "=", permissions.user_id),
                ),
            )
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: RequestBodySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("projects")
            .where("id", "=", params.id)
            .select(body.fields as SelectExpression<DB, "projects">[]);
          if (body?.relations?.character_relationship_types) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("character_relationship_types")
                  .select([
                    "character_relationship_types.id",
                    "character_relationship_types.title",
                    "character_relationship_types.ascendant_title",
                    "character_relationship_types.descendant_title",
                  ])
                  .where("project_id", "=", params.id),
              ).as("character_relationship_types"),
            );
          }

          if (body?.relations?.map_pin_types) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("map_pin_types")
                  .select([
                    "map_pin_types.id",
                    "map_pin_types.title",
                    "map_pin_types.default_icon",
                    "map_pin_types.default_icon_color",
                  ])
                  .where("project_id", "=", params.id),
              ).as("map_pin_types"),
            );
          }

          if (body?.relations?.members) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("users")
                  .leftJoin("_project_members", "_project_members.B", "users.id")
                  .where("_project_members.A", "=", params.id)
                  .whereRef("_project_members.B", "!=", "projects.owner_id")
                  .select([
                    "users.id",
                    "users.email",
                    "users.image",
                    "users.nickname",
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("user_roles")
                          .whereRef("user_roles.user_id", "=", "users.id")
                          .where("user_roles.project_id", "=", params.id)
                          .leftJoin("roles", "roles.id", "user_roles.role_id")
                          .select(["roles.id", "roles.title", "roles.icon"]),
                      ).as("role"),
                  ])
                  .orderBy("nickname", "asc"),
              ).as("members"),
            );
          }
          if (body?.relations?.owner) {
            query = query.select((eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom("users")
                  .whereRef("projects.owner_id", "=", "users.id")
                  .select(["users.id", "users.email", "users.image", "users.nickname"]),
              ).as("owner"),
            );
          }
          if (body?.relations?.game_system) {
            query = query.select((eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom("game_systems")
                  .whereRef("projects.game_system_id", "=", "game_systems.id")
                  .select(["game_systems.id", "game_systems.title", "game_systems.configuration", "game_systems.code"]),
              ).as("game_system"),
            );
          }

          if (body?.relations?.roles) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb.selectFrom("roles").select(["roles.id", "roles.title", "roles.icon"]).where("project_id", "=", params.id),
              ).as("roles"),
            );
          }
          if (body?.relations?.feature_flags) {
            query = query
              .leftJoin("user_project_feature_flags", (join) =>
                join
                  .on("user_project_feature_flags.user_id", "=", permissions.user_id)
                  .onRef("user_project_feature_flags.project_id", "=", "projects.id"),
              )
              .select(["feature_flags"]);
          }
          const data = await query.executeTakeFirstOrThrow();

          if (body?.relations?.tags) {
            const redis = await redisClient;
            const all_tags = await redis.get(`${params.id}-all_tags`);
            if (all_tags) {
              try {
                data.tags = JSON.parse(all_tags);
              } catch (error) {
                console.error(`Could not parse cached tags for project - ${params.id}`);
                const fetchedTags = await getAllProjectTags(params.id, permissions);
                data.tags = fetchedTags;

                // Cache tags
                redis.SET(`${params.id}-all_tags`, JSON.stringify(fetchedTags), { EX: 24 * 60 * 60 });
              }
            } else {
              // Fetch only if no cached tags available
              const fetchedTags = await getAllProjectTags(params.id, permissions);
              data.tags = fetchedTags;

              // Cache tags
              redis.SET(`${params.id}-all_tags`, JSON.stringify(fetchedTags), { EX: 24 * 60 * 60 });
            }
          }

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadProjectSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          await db
            .updateTable("projects")
            .where("projects.id", "=", params.id)
            .where("projects.owner_id", "=", permissions.user_id)
            .set(body.data)
            .execute();

          return { message: `Project ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        {
          body: UpdateProjectSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:id/dashboard",
        async ({ params, permissions, body }) => {
          const requests = [
            {
              name: "manuscripts",
              request: db
                .selectFrom("manuscripts")
                .select(["manuscripts.id", "manuscripts.title", "manuscripts.icon"])
                .where("project_id", "=", params.id)
                .where("manuscripts.owner_id", "=", permissions.user_id)
                .where("manuscripts.deleted_at", "is", null)
                .limit(5)
                .orderBy("updated_at desc")
                .execute(),
            },
            {
              name: "characters",
              request: db
                .selectFrom("characters")
                .select(["characters.id", "characters.full_name as title", "characters.portrait_id"])
                .where("project_id", "=", params.id)
                .where("characters.owner_id", "=", permissions.user_id)
                .where("characters.deleted_at", "is", null)
                .limit(5)
                .orderBy("updated_at desc")
                .execute(),
            },
            {
              name: "documents",
              request: db
                .selectFrom("documents")
                .select(["documents.id", "documents.title", "documents.icon"])
                .where("project_id", "=", params.id)
                .where("documents.owner_id", "=", permissions.user_id)
                .where("documents.deleted_at", "is", null)
                .orderBy("updated_at desc")
                .limit(5)
                .execute(),
            },

            {
              name: "blueprint_instances",
              request: db
                .selectFrom("blueprint_instances")
                .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                .select([
                  "blueprint_instances.id",
                  "blueprint_instances.title",
                  "blueprint_instances.parent_id",
                  "blueprints.icon",
                ])
                .where("blueprints.project_id", "=", params.id)
                .where("blueprint_instances.owner_id", "=", permissions.user_id)
                .where("blueprint_instances.deleted_at", "is", null)
                .orderBy("blueprint_instances.updated_at desc")
                .limit(5)
                .execute(),
            },
            {
              name: "maps",
              request: db
                .selectFrom("maps")
                .select(["id", "title", "icon"])
                .orderBy("updated_at desc")
                .where("project_id", "=", params.id)
                .where("owner_id", "=", permissions.user_id)
                .where("maps.deleted_at", "is", null)
                .limit(5)
                .execute(),
            },
            {
              name: "graphs",
              request: db
                .selectFrom("graphs")
                .select(["id", "title"])
                .where("graphs.project_id", "=", params.id)
                .where("owner_id", "=", permissions.user_id)
                .where("graphs.deleted_at", "is", null)
                .orderBy("updated_at desc")
                .limit(5)
                .execute(),
            },
            {
              name: "calendars",
              request: db
                .selectFrom("calendars")
                .select(["id", "title"])
                .where("calendars.project_id", "=", params.id)
                .where("owner_id", "=", permissions.user_id)
                .where("calendars.deleted_at", "is", null)
                .orderBy("updated_at desc")
                .limit(5)
                .execute(),
            },
            {
              name: "events",
              request: db
                .selectFrom("events")
                .select(["events.id", "events.title", "events.parent_id"])
                .leftJoin("calendars", "calendars.id", "events.parent_id")
                .where("calendars.project_id", "=", params.id)
                .where("events.owner_id", "=", permissions.user_id)
                .orderBy("events.updated_at desc")
                .limit(5)
                .execute(),
            },

            {
              name: "dictionaries",
              request: db
                .selectFrom("dictionaries")
                .select(["id", "title"])
                .where("dictionaries.project_id", "=", params.id)
                .where("owner_id", "=", permissions.user_id)
                .where("dictionaries.deleted_at", "is", null)
                .orderBy("updated_at desc")
                .limit(5)
                .execute(),
            },
          ].filter(
            (req) =>
              body.data.enabled_entities.includes(req.name) ||
              (req.name === "events" && body.data.enabled_entities.includes("calendars")) ||
              (req.name === "blueprint_instances" && body.data.enabled_entities.includes("blueprints")),
          );

          const data = await Promise.all(
            requests.map(async (item) => ({
              name: item.name,
              result: await item.request,
            })),
          );

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: DashboardSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/assign_role",
        async ({ body, headers }) => {
          const user_id = headers?.["user-id"];
          const project_id = headers?.["project-id"];

          const project = await db
            .selectFrom("projects")
            .select(["owner_id"])
            .where("projects.id", "=", project_id as string)
            .executeTakeFirst();

          if (project?.owner_id !== user_id) {
            return { message: "There was an error with this request.", ok: true, role_access: false };
          }

          await db
            .insertInto("user_roles")
            .values({
              user_id: body.data.user_id,
              role_id: body.data.role_id,
              project_id: project_id as string,
            })
            .onConflict((oc) => oc.columns(["user_id", "project_id"]).doUpdateSet({ role_id: body.data.role_id }))
            .execute();
          sendNotification(project_id as string, { entity_id: body.data.user_id, event_type: "ROLE_ASSIGNED" });

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: AssignRoleSchema,
          response: ResponseSchema,
        },
      )
      .get(
        "/api_key",
        async ({ permissions }) => {
          if (permissions.is_project_owner) {
            const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api_key`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ project_id: permissions.project_id }),
            });
            if (response.ok) {
              const data = (await response.json()) as { ok: boolean; data: string };

              if (data.ok) {
                return { data: data.data, ok: data.ok, message: MessageEnum.success, role_access: true };
              } else {
                return {
                  data: null,
                  ok: false,
                  role_access: false,
                  message: "You do not have permission to perform this action.",
                };
              }
            }
          } else {
            return { data: null, ok: false, role_access: false, message: "You do not have permission to perform this action." };
          }
          return { data: null, ok: false, role_access: false, message: "You do not have permission to perform this action." };
        },
        { response: ResponseWithDataSchema },
      )
      .get(
        "/api_key/reset",
        async ({ permissions }) => {
          if (permissions.is_project_owner) {
            const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api_key/reset`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ project_id: permissions.project_id }),
            });
            if (response.ok) {
              const data = (await response.json()) as { ok: boolean };

              if (data.ok) {
                return { ok: data.ok, message: MessageEnum.success, role_access: true };
              } else {
                return {
                  ok: false,
                  role_access: false,
                  message: "There was an error with your request.",
                };
              }
            }
          } else {
            return { ok: false, role_access: false, message: "You do not have permission to perform this action." };
          }
          return { ok: false, role_access: false, message: "There was an error with your request." };
        },
        { response: ResponseSchema },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          try {
            const res = await fetch(`${process.env.ASSET_SERVICE_URL}/assets/folder/${params.id}`, { method: "DELETE" });

            if (res.status !== 200) {
              console.error("SOME PROJECT IMAGES WERE NOT DELETED");
            }
          } catch (error) {
            console.error(error);
            return { message: "Could not delete images.", ok: false, role_access: true };
          }

          await db.deleteFrom("projects").where("projects.id", "=", params.id).execute();
          return { message: `Project ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
