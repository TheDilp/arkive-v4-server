import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertGraphSchema, ReadGraphSchema, UpdateGraphSchema } from "../database/validation/graphs";
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
          const data = InsertGraphSchema.parse(body.data);
          await db.transaction().execute(async (tx) => {
            const graph = await tx.insertInto("boards").values(data).returning("id").executeTakeFirstOrThrow();

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
            .where("project_id", "=", body.d)
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
                    .whereRef("nodes.parent_id", "=", "boards.id")
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
            .$if(!!body?.relations?.edges, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(eb.selectFrom("edges").selectAll().whereRef("edges.parent_id", "=", "boards.id")).as("edges"),
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

          if (body?.relations?.parents) {
            const parents = await GetBreadcrumbs({ db, id: params.id, table_name: "boards" });
            return { data: { ...data, parents }, message: "Success.", ok: true };
          }

          return { data, message: MessageEnum.success, ok: true };
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
              const data = UpdateGraphSchema.parse(body.data);
              await tx.updateTable("boards").where("id", "=", params.id).set(data).executeTakeFirstOrThrow();
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

          return { message: `Grpah ${MessageEnum.route_not_found}`, ok: true };
        },
        {
          body: UpdateGraphSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("boards").where("boards.id", "=", params.id).execute();
        return { message: `Graph ${MessageEnum.successfully_updated}`, ok: true };
      }),
  );
}
