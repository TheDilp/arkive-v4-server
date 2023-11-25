import { cors } from "@elysiajs/cors";
import { Elysia, ws } from "elysia";
import { verify } from "jsonwebtoken";
import * as jwtToPem from "jwk-to-pem";

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
  graph_router,
  health_check_router,
  map_pin_router,
  map_router,
  message_router,
  month_router,
  node_router,
  project_router,
  random_table_option_router,
  random_table_router,
  search_router,
  tag_router,
  user_router,
  webhook_router,
  websocket_router,
  word_router,
} from "./routers";

class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export const app = new Elysia()
  .state("auth", { userId: "" })
  .use(cors({ origin: process.env.NODE_ENV === "development" ? "*" : "https://thearkive.app" }))
  .use(ws())
  .addError({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ code, error, set }) => {
    if (code === "UNAUTHORIZED") {
      set.status = 403;
      return { message: "UNAUTHORIZED", ok: false };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found.", ok: false };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return { message: "There was an error with your request.", ok: false };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      console.log(error);
      return { message: "The payload was not formatted correctly.", ok: false };
    }
    console.error(error);
    return { message: "There was an error with your request.", ok: false };
  })
  .use(health_check_router)
  // Test
  .group("/api/v1", (server) =>
    // @ts-ignore
    server
      .onBeforeHandle(async ({ request }) => {
        const token = request.headers.get("authorization");
        if (token) {
          const jwtoken = token.replace("Bearer ", "");

          const jwtPublicKeyRes = await fetch(process.env.JWT_VERIFY_URL as string);
          const jwtPublicKey = await jwtPublicKeyRes.json();
          const publicKey = jwtToPem.default(jwtPublicKey.keys[0]);
          const verifiedToken: any = verify(jwtoken, publicKey, (err, result) => {
            if (err)
              return {
                name: "TokenExpiredError",
                message: "Session ended.",
                expiredAt: Date.now(),
                error: true,
              };
            return result;
          });
          if (verifiedToken.error) {
            throw new UnauthorizedError("UNAUTHORIZED");
          }
          if (verifiedToken.azp !== process.env.JWT_VERIFY_HOST || verifiedToken.exp * 1000 < Date.now()) {
            throw new UnauthorizedError("UNAUTHORIZED");
          }
        } else {
          throw new UnauthorizedError("UNAUTHORIZED");
        }
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
      .use(bulk_router),
  )
  .use(websocket_router)
  .listen((process.env.PORT as string) || 3000);

console.log("LISTENING ON", process.env.PORT);

export type App = typeof app;
