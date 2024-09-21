import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { Elysia } from "elysia";

import { db } from "./database/db";
// Accepts the same connection config object that the "pg" package would take
import { ErrorEnums, NicknameInUse, NoPublicAccess, NoRoleAccess, UnauthorizedError } from "./enums";
import { tempAfterHandle } from "./handlers";
import {
  asset_router,
  blueprint_instance_router,
  blueprint_router,
  bulk_router,
  calendar_router,
  character_fields_router,
  character_fields_templates_router,
  character_relationship_types_router,
  character_router,
  conversation_router,
  dictionary_router,
  document_router,
  edge_router,
  event_router,
  filter_router,
  game_router,
  gateway_access_router,
  gateway_configuration_router,
  graph_router,
  health_check_router,
  interaction_router,
  manuscript_router,
  map_pin_router,
  map_pin_types_router,
  map_router,
  message_router,
  month_router,
  node_router,
  notification_router,
  permission_router,
  project_router,
  random_table_option_router,
  random_table_router,
  role_router,
  search_router,
  stats_router,
  tag_router,
  user_router,
  webhook_router,
  websocket_router,
  word_router,
} from "./routers";
import type { PermissionDecorationType } from "./types/requestTypes";
import { getEntityFromPath, getPermissionOperationFromPath } from "./utils/requestUtils";
import { verifyJWT } from "./utils/userUtils";

export const app = new Elysia({ name: "Editor.Router" })
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NO_PUBLIC_ACCESS: NoPublicAccess,
    NO_ROLE_ACCESS: NoRoleAccess,
    NICKNAME_IN_USE: NicknameInUse,
  })
  .onError(({ code, error, set, cookie }) => {
    if (code === "UNAUTHORIZED") {
      const environment = process.env.NODE_ENV;
      set.status = 401;
      cookie.access.set({
        value: "None",
        httpOnly: true,
        secure: environment === "production",
        sameSite: environment === "production",
        path: "/",
      });
      cookie.refresh.set({
        value: "None",
        httpOnly: true,
        secure: environment === "production",
        sameSite: environment === "production",
        path: "/",
      });

      return { message: "UNAUTHORIZED", ok: false, role_access: false };
    }
    if (code === "NO_PUBLIC_ACCESS") {
      set.status = 403;
      return { message: "NO_PUBLIC_ACCESS", ok: false, role_access: false };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found.", ok: false, role_access: false };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return { message: "There was an error with your request.", ok: false, role_access: false };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      console.error(error);
      return { message: "There was an error with your request.", ok: false, role_access: false };
    }
    if (code === "NICKNAME_IN_USE") {
      set.status = 400;
      return { message: "Nickname already taken.", ok: false, role_access: true };
    }
    if (code === "NO_ROLE_ACCESS") {
      set.status = 200;
      return { message: "NO_ROLE_ACCESS", ok: false, role_access: false };
    }
    if (error?.message === "no result") {
      console.error(error);

      return {
        message: "This entity could not be found or you do not have permission to view it.",
        ok: true,
        role_access: false,
      };
    }
    console.error(error);
    return { message: "There was an error with your request.", ok: false, role_access: false };
  })
  .group("/api/v1" as any, (server) =>
    server.guard(
      {
        beforeHandle: async (context) => {
          const {
            headers,
            set,
            cookie: { access, refresh },
            path,
            request,
          } = context;
          // @ts-ignore
          const data = await verifyJWT({ module: headers?.["module"] as "editor" | "dyce_vtt" | null, access, refresh, set });
          if (data.status === "authenticated") {
            const { user_id, project_id, name } = data;
            headers["user-id"] = user_id;
            headers["name"] = name || undefined;
            headers["project-id"] = project_id || undefined;
            headers["user-image-url"] = data.image_url || undefined;

            const entity = getEntityFromPath(path);

            if (user_id) {
              const action = getPermissionOperationFromPath(path, request.method as "GET" | "POST" | "DELETE");
              const res = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/permission/${action}_${entity}`, {
                method: "GET",
                //  @ts-ignore
                headers: {
                  "Content-Type": "application/json",
                  "user-id": user_id,
                  "project-id": project_id,
                },
              });

              try {
                const permissions = (await res.json()) as Pick<
                  PermissionDecorationType,
                  "is_project_owner" | "all_permissions" | "role_access" | "role_id" | "permission_id"
                > & { user_id: string; project_id: string };

                permissions.user_id = user_id;
                permissions.project_id = project_id || "";
                // @ts-ignore
                context.permissions = permissions;
              } catch (error) {
                console.error(error);
              }
            } else {
              set.status = 403;
              throw new NoRoleAccess(ErrorEnums.no_role_access);
            }
          } else {
            set.status = 401;
            throw new UnauthorizedError(ErrorEnums.unauthorized);
          }
        },
        // @ts-ignore
        afterHandle: async (context, response) => {
          await tempAfterHandle(context, response);
          return response;
        },
      },

      (app) =>
        app
          .use(user_router)
          .use(project_router)
          .use(asset_router)
          .use(tag_router)
          .use(character_router)
          .use(conversation_router)
          .use(character_fields_templates_router)
          .use(character_fields_router)
          .use(character_relationship_types_router)
          .use(document_router)
          .use(map_router)
          .use(map_pin_router)
          .use(map_pin_types_router)
          .use(graph_router)
          .use(node_router)
          .use(edge_router)
          .use(blueprint_router)
          .use(blueprint_instance_router)
          .use(calendar_router)
          .use(month_router)
          .use(event_router)
          .use(dictionary_router)
          .use(word_router)
          .use(random_table_router)
          .use(random_table_option_router)
          .use(webhook_router)
          .use(search_router)
          .use(message_router)
          .use(bulk_router)
          .use(notification_router)
          .use(manuscript_router)
          .use(stats_router)
          .use(role_router)
          .use(permission_router)
          .use(gateway_configuration_router)
          .use(game_router)
          .use(filter_router),
    ),
  )
  .use(gateway_access_router)
  .use(websocket_router)
  .use(interaction_router)
  .use(health_check_router)
  .use(
    cors({
      exposeHeaders: ["content-disposition"],
      origin:
        process.env.NODE_ENV === "development"
          ? true
          : [
              process.env.EDITOR_CLIENT_URL as string,
              process.env.HOME_CLIENT_URL as string,
              process.env.GATEWAY_CLIENT_URL as string,
            ],
      methods: ["GET", "POST", "DELETE"],
    }),
  )
  .use(
    cron({
      name: "heartbeat",
      pattern: "0 0 */1 * *",
      run() {
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);
        db.deleteFrom("notifications").where("created_at", "<", threeDaysAgo).execute();

        console.info(`DELETED NOTIFICATIONS OLDER THAN ${threeDaysAgo}`);
      },
    }),
  )
  .onStart(() => console.info(`LISTENING ON PORT ${process.env.PORT} 🚀`));

try {
  app.listen((process.env.PORT as string) || 3000);
} catch (err) {
  console.error(err);
}
