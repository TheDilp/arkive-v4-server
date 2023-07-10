import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertTagType } from "../database/validation";

export function tag_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post("/create", async (req: FastifyRequest<{ Body: { data: InsertTagType | InsertTagType[] } }>, rep) => {
    const { data } = req.body;
    await db.insertInto("tags").values(data).execute();

    rep.send({
      message: `${(Array.isArray(data) && data.length === 1) || !Array.isArray(data) ? "Tag" : "Tags"} successfully created.`,
      ok: true,
    });
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
