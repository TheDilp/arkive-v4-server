import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastify, { errorCodes } from "fastify";
import fileUpload from "fastify-file-upload";
import path from "path";

import {
  asset_router,
  authentication_router,
  board_router,
  character_fields_templates_router,
  character_router,
  document_router,
  edge_router,
  map_pin_router,
  map_router,
  node_router,
  project_router,
  tag_router,
  user_router,
} from "./routers";
import { search_router } from "./routers/search_router";

const server = fastify();

server.setErrorHandler(function (error, request, reply) {
  if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
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
    instance.register(character_router, { prefix: "/characters" });
    instance.register(character_fields_templates_router, { prefix: "/character_fields_templates" });
    instance.register(document_router, { prefix: "/documents" });
    instance.register(map_router, { prefix: "/maps" });
    instance.register(map_pin_router, { prefix: "/map_pins" });
    instance.register(board_router, { prefix: "/graphs" });
    instance.register(node_router, { prefix: "/nodes" });
    instance.register(edge_router, { prefix: "/edges" });
    instance.register(search_router, { prefix: "/search" });
    done();
  },
  { prefix: "/api/v1" },
);

server.get("/ping", async () => {
  return "pong\n";
});

server.listen({ port: parseInt(process.env.PORT as string, 10) || 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
