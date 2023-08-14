import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { RequestBodyType } from "../types/requestTypes";

export function character_fields_router(server: FastifyInstance, _: any, done: any) {
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const character_fields = await db
      .selectFrom("character_fields")
      .selectAll()
      .where("character_fields.parent_id", "=", req.body.data.parent_id)
      .execute();

    rep.send({ data: character_fields, message: "Success.", ok: true });
  });

  done();
}
