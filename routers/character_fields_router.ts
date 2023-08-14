import { FastifyInstance, FastifyRequest } from "fastify";
import { RequestBodyType } from "../types/requestTypes";
import { db } from "../database/db";

export function character_fields_templates_router(server: FastifyInstance, _: any, done: any) {
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const character_fields = await db.selectFrom("character_fields").selectAll().where("");
  });

  done();
}
