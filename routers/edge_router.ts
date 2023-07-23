import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertEdgeSchema, InsertEdgeType, UpdateEdgeSchema, UpdateEdgeType } from "../database/validation/edges";
import { RequestBodyType } from "../types/requestTypes";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function edge_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertEdgeType; relations?: { tags?: { id: string }[] } } }>, rep) => {
      await db.transaction().execute(async (tx) => {
        const data = InsertEdgeSchema.parse(req.body.data);
        const edge = await tx.insertInto("edges").values(data).returning("id").executeTakeFirstOrThrow();

        if (req.body.relations?.tags) {
          await CreateTagRelations({ relationalTable: "_edgesTotags", tags: req.body.relations.tags, id: edge.id, tx });
        }
      });

      rep.send({ message: "Edge successfully created.", ok: true });
    },
  );

  // #endregion create_routes

  // #region read_routes
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("edges")
      .selectAll()
      .where("edges.id", "=", req.params.id)
      .$if(!!req.body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_edgesTotags", "edges")))
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateEdgeType; relations?: { tags?: { id: string }[] } } }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const data = UpdateEdgeSchema.parse(req.body.data);
          await tx.updateTable("edges").where("id", "=", req.params.id).set(data).executeTakeFirstOrThrow();
        }
        if (req.body?.relations) {
          if (req.body.relations?.tags)
            await UpdateTagRelations({
              relationalTable: "_edgesTotags",
              id: req.params.id,
              newTags: req.body.relations.tags,
              tx,
            });
        }
      });

      rep.send({ message: "Edge successfully updated.", ok: true });
    },
  );
  // #endregion update_routes
  // #region delete_routes
  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep,
    ) => {
      await db.deleteFrom("edges").where("edges.id", "=", req.params.id).execute();
      rep.send({ message: "Edge successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
