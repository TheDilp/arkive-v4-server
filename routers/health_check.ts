import { FastifyInstance } from "fastify";

export function health_check_router(server: FastifyInstance, _: any, done: any) {
  server.get("/", async (_, rep) => {
    rep.send({ basecheck: true, ok: true }).status(200);
  });

  done();
}
