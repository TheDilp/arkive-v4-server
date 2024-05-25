import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertProjectSchema,
  ProjectListSchema,
  ReadProjectSchema,
  UpdateProjectSchema,
} from "../database/validation/projects";
import { DefaultFeatureFlags } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler, beforeRoleHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { decodeUserJwt } from "../utils/requestUtils";
import { deleteFolder } from "../utils/s3Utils";

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
            const project = await tx.insertInto("projects").values(body.data).returning("id").executeTakeFirst();
            if (project) {
              await tx
                .insertInto("user_project_feature_flags")
                .values({
                  project_id: project?.id,
                  user_id: permissions.user_id,
                  feature_flags: JSON.stringify(DefaultFeatureFlags),
                })
                .execute();
            }
          });
          return { message: `Project ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertProjectSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, undefined, true),
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          const data = await db
            .selectFrom("projects")
            .leftJoin("users", "users.id", "projects.owner_id")
            .leftJoin("user_project_feature_flags", (join) =>
              join
                .on("user_project_feature_flags.user_id", "=", permissions.user_id)
                .onRef("user_project_feature_flags.project_id", "=", "projects.id"),
            )
            .select(["projects.id", "projects.title", "projects.image_id", "user_project_feature_flags.feature_flags"])
            .where("users.auth_id", "=", body.data.auth_id)
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
                  eb.selectFrom("users").select("id").where("users.auth_id", "=", body.data.auth_id),
                ),
            )
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ProjectListSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => {
            const jwt = context?.headers?.["authorization"]?.replace("Bearer ", "");
            if (jwt) {
              const { user_id } = decodeUserJwt(jwt);
              // @ts-ignore
              context.permissions.user_id = user_id;
            }
          },
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
                  .orderBy("email", "asc"),
              ).as("members"),
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
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadProjectSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => {
            const jwt = context?.headers?.["authorization"]?.replace("Bearer ", "");
            if (jwt) {
              const { user_id } = decodeUserJwt(jwt);
              // @ts-ignore
              context.permissions.user_id = user_id;
            }
          },
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("projects").where("projects.id", "=", params.id).set(body.data).execute();

          return { message: `Project ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        {
          body: UpdateProjectSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
        },
      )
      .get(
        "/:id/dashboard",
        async ({ params, permissions }) => {
          const requests = [
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
                .select(["blueprint_instances.id", "blueprint_instances.title", "blueprint_instances.parent_id"])
                .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
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
          ];

          const data = await Promise.all(
            requests.map(async (item) => ({
              name: item.name,
              result: await item.request,
            })),
          );

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, undefined, true),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          const filePath = `assets/${params.id}`;
          try {
            await deleteFolder(filePath);
          } catch (error) {
            return { message: "Could not delete images.", ok: false, role_access: true };
          }

          await db.deleteFrom("projects").where("projects.id", "=", params.id).execute();
          return { message: `Project ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
        },
      ),
  );
}
