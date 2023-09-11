import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastify, { errorCodes } from "fastify";
import fileUpload from "fastify-file-upload";
import path from "path";
import { ZodError } from "zod";

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
import Elysia, { t } from "elysia";

const server = fastify();

server.setErrorHandler(function (error, request, reply) {
  if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
  } else if (error instanceof ZodError) {
    this.log.error(error);
    // Send error response
    console.log(JSON.stringify(error));
    reply.status(500).send({ message: "The data was not formatted correctly.", ok: false });
  } else {
    // fastify will use parent error handler to handle this
    reply.send(error);
  }
});

server.register(fastifyStatic, {
  root: path.join(__dirname, "assets"),
});
server.register(fileUpload);

server.register(cors, {
  origin: process.env.NODE_ENV === "development" ? "*" : "https://thearkive.app",
});

server.register(authentication_router, { prefix: "/api/v1/auth" });

server.register(
  (instance, _, done) => {
    // instance.addHook("onRequest", async (request, reply) => {});
    instance.register(asset_router, { prefix: "/assets" });
    instance.register(user_router, { prefix: "/users" });
    instance.register(project_router, { prefix: "/projects" });
    instance.register(tag_router, { prefix: "/tags" });
    // instance.register(character_router, { prefix: "/characters" });
    instance.register(character_fields_templates_router, { prefix: "/character_fields_templates" });
    instance.register(character_fields_router, { prefix: "/character_fields" });
    instance.register(document_router, { prefix: "/documents" });
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
  .use(health_check_router)
  .onError(({ code, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found.", ok: false };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return { message: "There was an error with your request.", ok: false };
    }
  })
  .guard({
    response: {
      400: t.Object({
        message: t.String(),
        ok: t.Boolean({ default: false }),
      }),
      404: t.Object({
        message: t.String(),
        ok: t.Boolean({ default: false }),
      }),
    },
  })
  .group("/api/v1", (server) => server.use(character_router))
  .listen((process.env.PORT as string) || 3000);
