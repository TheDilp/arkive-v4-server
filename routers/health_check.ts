import Elysia from "elysia";
import { FastifyInstance } from "fastify";

export function health_check_router(app: Elysia) {
  return app.get("/health_check", async () => {
    return { basecheck: true, ok: true };
  });
}
