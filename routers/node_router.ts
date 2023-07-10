import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertNodeSchema, InsertNodeType, UpdateNodeSchema, UpdateNodeType } from "../database/validation/nodes";
import { RequestBodyType } from "../types/requestTypes";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function node_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertNodeType; relations?: { tags?: string[] } } }>, rep) => {
      await db.transaction().execute(async (tx) => {
        const data = InsertNodeSchema.parse(req.body.data);
        const node = await tx.insertInto("nodes").values(data).returning("id").executeTakeFirstOrThrow();

        if (req.body.relations?.tags) {
          await CreateTagRelations({ relationalTable: "_nodesTotags", tags: req.body.relations.tags, id: node.id, tx });
        }
      });

      rep.send({ message: "Node successfully created.", ok: true });
    },
  );

  // #endregion create_routes

  // #region read_routes
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("nodes")
      .selectAll()
      .where("nodes.id", "=", req.params.id)
      .$if(!!req.body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_nodesTotags", "nodes")))
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateNodeType; relations?: { tags?: string[] } } }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const data = UpdateNodeSchema.parse(req.body.data);
          await tx.updateTable("nodes").set(data).executeTakeFirstOrThrow();
        }
        if (req.body?.relations) {
          if (req.body.relations?.tags)
            await UpdateTagRelations({
              relationalTable: "_nodesTotags",
              id: req.params.id,
              newTags: req.body.relations.tags,
              tx,
            });
        }
      });

      rep.send({ message: "Node successfully updated.", ok: true });
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
      await db.deleteFrom("nodes").where("nodes.id", "=", req.params.id).execute();
      rep.send({ message: "Node successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
