import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InserDictionaryType, InsertDictionarySchema } from "../database/validation/dictionaries";

export function dictionary_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post("/create", async (req: FastifyRequest<{ Body: { data: InserDictionaryType } }>, rep) => {
    const parsedData = InsertDictionarySchema.parse(req.body.data);
    await db.insertInto("dictionaries").values(parsedData).execute();
    rep.send({ ok: true, message: "Success" });
  });
  // #endregion create_routes
  // #region read_routes
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  server.post("/delete/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
    await db.deleteFrom("dictionaries").where("id", "=", req.params.id).execute();
    rep.send({ ok: true, message: "Success" });
  });
  // #endregion delete_routes

  done();
}
