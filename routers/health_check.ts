import Elysia from "elysia";
import { FastifyInstance } from "fastify";

export function health_check_router(app: Elysia) {
  return app.get("/health_check", async ({ set }) => {
    set.status = 200;
    return { basecheck: true, ok: true };
  });
}
