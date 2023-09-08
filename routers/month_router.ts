import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { RequestBodyType } from "../types/requestTypes";

export function month_router(server: FastifyInstance, _: any, done: any) {
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db.selectFrom("months").where("months.parent_id", "=", req.body.data?.parent_id).selectAll().execute();

    rep.send({ data, message: "Success", ok: true });
  });
  done();
}
