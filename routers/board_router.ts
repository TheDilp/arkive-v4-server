import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import { InsertBoardSchema, InsertBoardType, UpdateBoardSchema, UpdateBoardType } from "../database/validation/graphs";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrderBy } from "../utils/orderByConstructor";
import {
  CreateTagRelations,
  GetBreadcrumbs,
  GetEntityChildren,
  TagQuery,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";

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
      .$if(!req.body.data?.item_id, (qb) => qb.where("parent_id", "is", null))
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "boards">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("boards", qb, req.body.filters);
        return qb;
      })
      .limit(req.body?.pagination?.limit || 10)
      .offset((req.body?.pagination?.page ?? 0) * (req.body?.pagination?.limit || 10))
      .$if(!!req.body.orderBy, (qb) => constructOrderBy(qb, req.body.orderBy?.field as string, req.body.orderBy?.sort))
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db

      .selectFrom("boards")
      .where("boards.id", "=", req.params.id)
      .$if(!!req.body?.relations?.children, (qb) =>
        GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "boards"),
      )
      .$if(!!req.body?.relations?.nodes, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("nodes")
              .whereRef("nodes.parent_id", "=", "boards.id")
              .leftJoin("characters", (join) => join.onRef("characters.id", "=", "nodes.character_id"))
              .select((sb) => [
                "nodes.id",
                "nodes.label",
                "nodes.background_color",
                "nodes.background_opacity",
                "nodes.font_color",
                "nodes.font_family",
                "nodes.type",
                "nodes.image_id",
                "nodes.text_h_align",
                "nodes.text_v_align",
                "nodes.x",
                "nodes.y",
                "nodes.z_index",
                "nodes.width",
                "nodes.height",
                "nodes.is_locked",
                jsonObjectFrom(
                  sb
                    .selectFrom("characters")
                    .select(["characters.first_name", "characters.last_name", "characters.portrait_id"])
                    .whereRef("characters.id", "=", "nodes.character_id"),
                ).as("character"),
              ]),
          ).as("nodes"),
        ),
      )
      .$if(!!req.body?.relations?.edges, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("edges").selectAll().whereRef("edges.parent_id", "=", "boards.id")).as("edges"),
        ),
      )
      .$if(!!req.body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_boardsTotags", "boards")))
      .select([
        "boards.id",
        "boards.title",
        "boards.icon",
        "boards.is_folder",
        "boards.is_public",
        "boards.parent_id",
        "boards.default_node_shape",
        "boards.default_node_color",
        "boards.default_edge_color",
      ])
      .executeTakeFirstOrThrow();

    if (req.body?.relations?.parents) {
      const parents = await GetBreadcrumbs({ db, id: req.params.id, table_name: "boards" });
      rep.send({ data: { ...data, parents }, message: "Success.", ok: true });
    }

    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateBoardType; relations?: { tags?: { id: string }[] } } }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const data = UpdateBoardSchema.parse(req.body.data);
          await tx.updateTable("boards").where("id", "=", req.params.id).set(data).executeTakeFirstOrThrow();
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

      rep.send({ message: "Graph successfully updated.", ok: true });
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
      rep.send({ message: "Graph successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
