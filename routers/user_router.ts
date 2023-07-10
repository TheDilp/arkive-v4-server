import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertUserType } from "../database/validation";

export function user_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post("/create", async (req: FastifyRequest<{ Body: { data: InsertUserType } }>, rep) => {
    await db.insertInto("users").values(req.body.data).execute();
    rep.send("TEST");
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
