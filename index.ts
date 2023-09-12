import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import fastify from "fastify";

import {
  asset_router,
  authentication_router,
  board_router,
  character_fields_router,
  character_fields_templates_router,
  character_router,
  document_router,
  edge_router,
  health_check_router,
  map_pin_router,
  map_router,
  node_router,
  project_router,
  random_table_option_router,
  random_table_router,
  search_router,
  tag_router,
  user_router,
} from "./routers";
import { calendar_router } from "./routers/calendar_router";
import { dictionary_router } from "./routers/dictionary_router";
import { event_router } from "./routers/event_router";
import { month_router } from "./routers/month_router";
import { timeline_router } from "./routers/timeline_router";
import { word_router } from "./routers/word_router";

const server = fastify();

server.register(authentication_router, { prefix: "/api/v1/auth" });

server.register(
  (instance, _, done) => {
    instance.register(user_router, { prefix: "/users" });
    // instance.register(document_router, { prefix: "/documents" });
    instance.register(map_router, { prefix: "/maps" });
    instance.register(map_pin_router, { prefix: "/map_pins" });
    instance.register(board_router, { prefix: "/graphs" });
    instance.register(node_router, { prefix: "/nodes" });
    instance.register(edge_router, { prefix: "/edges" });
    instance.register(calendar_router, { prefix: "/calendars" });
    instance.register(month_router, { prefix: "/months" });
    instance.register(event_router, { prefix: "/events" });
    instance.register(timeline_router, { prefix: "/timelines" });
    instance.register(dictionary_router, { prefix: "/dictionaries" });
    instance.register(word_router, { prefix: "/words" });
    instance.register(random_table_router, { prefix: "/random_tables" });
    instance.register(random_table_option_router, { prefix: "/random_table_options" });
    instance.register(search_router, { prefix: "/search" });
    done();
  },
  { prefix: "/api/v1" },
);

// server.listen({ port: parseInt(process.env.PORT as string, 10) || 3000 }, (err, address) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//   console.log(`Server listening at ${address}`);
// });

const app = new Elysia()
  .use(cors({ origin: process.env.NODE_ENV === "development" ? "*" : "https://thearkive.app" }))
  .onError(({ code, error, set }) => {
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
  })
  .group("/api/v1", (server) =>
    server
      .use(health_check_router)
      .use(project_router)
      .use(asset_router)
      .use(tag_router)
      .use(character_router)
      .use(character_fields_templates_router)
      .use(character_fields_router)
      .use(document_router),
  )
  .use(swagger())
  .listen((process.env.PORT as string) || 3000);

export type App = typeof app;
