import { cors } from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { Elysia } from "elysia";

import { db } from "./database/db";
// Accepts the same connection config object that the "pg" package would take
import { NoPublicAccess, NoRoleAccess, UnauthorizedError } from "./enums";
import { tempAfterHandle } from "./handlers";
import {
  asset_router,
  auth_router,
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
  graph_router,
  health_check_router,
  map_pin_router,
  map_pin_types_router,
  map_router,
  message_router,
  meta_router,
  month_router,
  node_router,
  notification_router,
  permission_router,
  project_router,
  public_router,
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

export const app = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NO_PUBLIC_ACCESS: NoPublicAccess,
    NO_ROLE_ACCESS: NoRoleAccess,
  })
  .onError(({ code, error, set }) => {
    if (code === "UNAUTHORIZED") {
      set.status = 403;
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
      return { message: "The payload was not formatted correctly.", ok: false, role_access: false };
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
  .onStart(() => console.info(`Listening on ${process.env.PORT}`))
  .use(
    cors({
      origin: process.env.NODE_ENV === "development" ? true : "arkive-v4-auth-service.railway.internal",
      methods: ["GET", "POST", "DELETE"],
    }),
  )

  .use(health_check_router)

  .group("/api/v1", (server: Elysia) =>
    server
      // @ts-ignore
      .onAfterHandle(async (context, response) => {
        await tempAfterHandle(context, response);
        return response;
      })

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
      .use(stats_router)
      .use(role_router)
      .use(permission_router),
  )
  .use(public_router)
  .use(meta_router)
  .use(auth_router)
  .use(websocket_router)
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
  );

try {
  app.listen((process.env.PORT as string) || 3000);
} catch (err) {
  console.error(err);
}
