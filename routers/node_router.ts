import { FastifyInstance, FastifyRequest } from "fastify";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { InsertNodeSchema, InsertNodeType, UpdateNodeSchema, UpdateNodeType } from "../database/validation/nodes";
import { RequestBodyType } from "../types/requestTypes";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function node_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertNodeType; relations?: { tags?: { id: string }[] } } }>, rep) => {
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
      .$if(!!req.body?.relations?.image, (qb) =>
        qb.select((eb) =>
          jsonObjectFrom(eb.selectFrom("images").whereRef("images.id", "=", "nodes.image_id").select(["id", "title"])).as(
            "image",
          ),
        ),
      )
      .$if(!!req.body?.relations?.character, (qb) =>
        qb.select((eb) =>
          jsonObjectFrom(
            eb
              .selectFrom("characters")
              .whereRef("characters.id", "=", "nodes.character_id")
              .select(["id", "first_name", "last_name", "portrait_id"]),
          ).as("character"),
        ),
      )
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateNodeType; relations?: { tags?: { id: string }[] } } }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const data = UpdateNodeSchema.parse(req.body.data);
          await tx.updateTable("nodes").set(data).where("nodes.id", "=", req.params.id).executeTakeFirstOrThrow();
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
  server.post(
    "/update/many/position",
    async (req: FastifyRequest<{ Body: { data: { nodes: { id: string; x: number; y: number }[] } } }>, rep) => {
      await db.transaction().execute(async (tx) => {
        await Promise.all(
          req.body.data.nodes.map((node) =>
            tx.updateTable("nodes").where("id", "=", node.id).set({ x: node.x, y: node.y }).execute(),
          ),
        );
      });

      rep.send({ message: "Nodes successfully updated.", ok: true });
    },
  );
  server.post(
    "/update/many/lock",
    async (req: FastifyRequest<{ Body: { data: { nodes: { id: string; is_locked: boolean }[] } } }>, rep) => {
      await db.transaction().execute(async (tx) => {
        await Promise.all(
          req.body.data.nodes.map((node) =>
            tx.updateTable("nodes").where("id", "=", node.id).set({ is_locked: node.is_locked }).execute(),
          ),
        );
      });

      rep.send({ message: "Nodes successfully updated.", ok: true });
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
