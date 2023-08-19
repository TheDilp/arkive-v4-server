import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertTagSchema, InsertTagType, UpdateTagSchema, UpdateTagType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function tag_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post("/create", async (req: FastifyRequest<{ Body: { data: InsertTagType | InsertTagType[] } }>, rep) => {
    const { data } = req.body;

    const parsedData = InsertTagSchema.parse(data);

    await db.insertInto("tags").values(parsedData).execute();

    rep.send({
      message: `${(Array.isArray(data) && data.length === 1) || !Array.isArray(data) ? "Tag" : "Tags"} successfully created.`,
      ok: true,
    });
  });

  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("tags")
      .select(["id", "title", "color"])
      .$if(!!req.body.orderBy?.length, (qb) => {
        qb = constructOrdering(req.body.orderBy, qb);
        return qb;
      })
      .where("project_id", "=", req.body.data.project_id)
      .execute();

    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateTagType | UpdateTagType[] } }>, rep) => {
      const parsedData = UpdateTagSchema.parse(req.body.data);
      await db.updateTable("tags").where("id", "=", req.params.id).set(parsedData).execute();

      rep.send({ message: "Tags successfully updated.", ok: true });
    },
  );
  // #endregion update_routes
  // #region delete_routes
  server.delete("/delete/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
    await db.deleteFrom("tags").where("id", "=", req.params.id).execute();
    rep.send({ message: "Tag successfully deleted.", ok: true });
  });
  // #endregion delete_routes

  done();
}
