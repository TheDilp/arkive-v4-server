import { randomUUID } from "crypto";
import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { GenerateGraphSchema, InsertGraphSchema, ReadGraphSchema, UpdateGraphSchema } from "../database/validation/graphs";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateTagRelations,
  GetBreadcrumbs,
  GetEntityChildren,
  TagQuery,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";

export function graph_router(app: Elysia) {
  return app.group("/graphs", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const graph = await tx.insertInto("boards").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations?.tags)
              await CreateTagRelations({ tx, relationalTable: "_boardsTotags", id: graph.id, tags: body.relations.tags });
          });
          return { message: `Graph ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertGraphSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("boards")
            .where("project_id", "=", body.data.project_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "boards">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("boards", qb, body.filters);
              return qb;
            })
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db

            .selectFrom("boards")
            .where("boards.id", "=", params.id)
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "boards"),
            )
            .$if(!!body?.relations?.nodes, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("nodes")
                    .where("nodes.parent_id", "=", params.id)
                    .leftJoin("characters", (join) => join.onRef("characters.id", "=", "nodes.character_id"))
                    .select((sb) => [
                      "nodes.id",
                      "nodes.label",
                      "nodes.background_color",
                      "nodes.background_opacity",
                      "nodes.font_color",
                      "nodes.font_family",
                      "nodes.font_size",
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

            .$if(!!body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_boardsTotags", "boards")))
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
          const edges = body?.relations?.edges
            ? await db.selectFrom("edges").selectAll().where("edges.parent_id", "=", params.id).execute()
            : [];

          const parents = body?.relations?.parents ? await GetBreadcrumbs({ db, id: params.id, table_name: "boards" }) : [];
          const finalData: typeof data & { parents?: any[]; edges?: any[] } = { ...data };

          if (parents.length) {
            finalData.parents = parents;
          }
          if (edges.length) {
            finalData.edges = edges;
          }

          return {
            data: finalData,
            message: MessageEnum.success,
            ok: true,
          };
        },
        {
          body: ReadGraphSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await tx.updateTable("boards").where("id", "=", params.id).set(body.data).executeTakeFirstOrThrow();
            }
            if (body?.relations) {
              if (body.relations?.tags)
                await UpdateTagRelations({
                  relationalTable: "_boardsTotags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                });
            }
          });

          return { message: `Graph ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateGraphSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/generate",
        async ({ body }) => {
          let graphId = "";
          await db.transaction().execute(async (tx) => {
            const { id } = await tx.insertInto("boards").values(body.data).returning("id").executeTakeFirstOrThrow();
            graphId = id;
            const { nodes, edges } = body.relations;

            const nodeIdDict: Record<string, string> = {};

            if (nodes.length) {
              for (let index = 0; index < nodes.length; index++) {
                nodeIdDict[nodes[index].data.id] = randomUUID();
              }
              await tx
                .insertInto("nodes")
                .values(nodes.map((n) => ({ ...n.data, id: nodeIdDict[n.data.id], parent_id: id })))
                .execute();
            }
            if (edges && edges.length) {
              const formattedEdges = edges.map((e) => {
                e.data.source_id = nodeIdDict[e.data.source_id];
                e.data.target_id = nodeIdDict[e.data.target_id];
                return e;
              });
              await tx
                .insertInto("edges")
                .values(formattedEdges.map((e) => ({ ...e.data, parent_id: id })))
                .execute();
            }
          });
          return { message: `Graph ${MessageEnum.successfully_created}`, ok: true, data: { id: graphId } };
        },
        { body: GenerateGraphSchema, response: ResponseWithDataSchema },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("boards").where("boards.id", "=", params.id).execute();
        return { message: `Graph ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
