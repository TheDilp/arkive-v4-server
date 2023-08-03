import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertAlterNamesSchema, InsertAlterNamesType } from "../database/validation/alter_names";

export function alter_name_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post("/create", async (req: FastifyRequest<{ Body: { data: InsertAlterNamesType } }>, rep) => {
    const parsedData = InsertAlterNamesSchema.parse(req.body.data);

    const data = await db.insertInto("alter_names").values(parsedData).returning("id").executeTakeFirstOrThrow();

    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion create_routes
  // #region read_routes
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  // #endregion delete_routes

  done();
}
