import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertBoardSchema, InsertBoardType, UpdateBoardSchema, UpdateBoardType } from "../database/validation/boards";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function board_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertBoardType; relations?: { tags?: { id: string }[] } } }>, rep) => {
      const data = InsertBoardSchema.parse(req.body.data);
      await db.transaction().execute(async (tx) => {
        const graph = await tx.insertInto("boards").values(data).returning("id").executeTakeFirstOrThrow();

        if (req.body?.relations?.tags)
          await CreateTagRelations({ tx, relationalTable: "_boardsTotags", id: graph.id, tags: req.body.relations.tags });
      });
      rep.send({ message: "Graph successfully created.", ok: true });
    },
  );

  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("boards")
      .$if(!req.body.fields.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "boards">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("boards", qb, req.body.filters);
        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("boards")
      .selectAll()
      .where("boards.id", "=", req.params.id)
      .$if(!!req.body?.relations?.nodes, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("nodes").selectAll().whereRef("nodes.parent_id", "=", "boards.id")).as("nodes"),
        ),
      )
      .$if(!!req.body?.relations?.edges, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("edges").selectAll().whereRef("edges.parent_id", "=", "boards.id")).as("edges"),
        ),
      )
      .$if(!!req.body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_boardsTotags", "boards")))
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateBoardType; relations?: { tags?: string[] } } }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const data = UpdateBoardSchema.parse(req.body.data);
          await tx.updateTable("boards").set(data).executeTakeFirstOrThrow();
        }
        if (req.body?.relations) {
          if (req.body.relations?.tags)
            await UpdateTagRelations({
              relationalTable: "_boardsTotags",
              id: req.params.id,
              newTags: req.body.relations.tags,
              tx,
            });
        }
      });

      rep.send({ message: "Board successfully updated.", ok: true });
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
      await db.deleteFrom("boards").where("boards.id", "=", req.params.id).execute();
      rep.send({ message: "Board successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
