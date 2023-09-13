import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import {
  asset_router,
  calendar_router,
  character_fields_router,
  character_fields_templates_router,
  character_router,
  dictionary_router,
  document_router,
  edge_router,
  event_router,
  graph_router,
  health_check_router,
  map_pin_router,
  map_router,
  month_router,
  node_router,
  project_router,
  random_table_option_router,
  random_table_router,
  search_router,
  tag_router,
  user_router,
  word_router,
} from "./routers";

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
      .use(user_router)
      .use(project_router)
      .use(asset_router)
      .use(tag_router)
      .use(character_router)
      .use(character_fields_templates_router)
      .use(character_fields_router)
      .use(document_router)
      .use(map_router)
      .use(map_pin_router)
      .use(graph_router)
      .use(node_router)
      .use(edge_router)
      .use(calendar_router)
      .use(month_router)
      .use(event_router)
      .use(dictionary_router)
      .use(word_router)
      .use(random_table_router)
      .use(random_table_option_router)
      .use(search_router),
  )
  .use(swagger())
  .listen((process.env.PORT as string) || 3000);

export type App = typeof app;
