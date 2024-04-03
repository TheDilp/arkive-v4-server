import { randomUUID } from "crypto";
import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { GenerateGraphSchema, InsertGraphSchema, ReadGraphSchema, UpdateGraphSchema } from "../database/validation/graphs";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetEntityChildren,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

export function graph_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/graphs", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const graph = await tx
                .insertInto("graphs")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations?.tags?.length)
                await CreateTagRelations({ tx, relationalTable: "_graphsTotags", id: graph.id, tags: body.relations.tags });

              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, graph.id, "graph_permissions", body.permissions);
              }
            });
            return { message: `Graph ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertGraphSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_graphs"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("graphs")
              .distinctOn(
                body.orderBy?.length ? (["graphs.id", ...body.orderBy.map((order) => order.field)] as any) : "graphs.id",
              )
              .where("project_id", "=", body.data.project_id)
              .where("graphs.deleted_at", body.arkived ? "is not" : "is", null)
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields.map((f) => `graphs.${f}`) as SelectExpression<DB, "graphs">[]),
              )
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("graphs", qb, body.filters);
                return qb;
              })
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "graphs");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "graphs"),
              )
              .$if(!!body?.relations?.tags, (qb) =>
                qb.select((eb) =>
                  TagQuery(
                    eb,
                    "_graphsTotags",
                    "graphs",
                    permissions.is_project_owner,
                    permissions.user_id,
                    "graph_permissions",
                  ),
                ),
              )
              .$if(!!body.orderBy?.length, (qb) => {
                qb = constructOrdering(body.orderBy, qb);
                return qb;
              })
              .execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: EntityListSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_graphs"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            const data = await db
              .selectFrom("graphs")
              .where("graphs.id", "=", params.id)
              .$if(!!body?.relations?.children, (qb) =>
                GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "graphs"),
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
                        "nodes.icon",
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
                  jsonArrayFrom(eb.selectFrom("edges").where("edges.parent_id", "=", params.id).selectAll()).as("edges"),
                ),
              )
              .$if(!!body?.relations?.tags, (qb) =>
                qb.select((eb) =>
                  TagQuery(
                    eb,
                    "_graphsTotags",
                    "graphs",
                    permissions.is_project_owner,
                    permissions.user_id,
                    "graph_permissions",
                  ),
                ),
              )
              .select([
                "graphs.id",
                "graphs.title",
                "graphs.icon",
                "graphs.is_folder",
                "graphs.is_public",
                "graphs.parent_id",
                "graphs.default_node_shape",
                "graphs.default_node_color",
                "graphs.default_edge_color",
              ])
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "graphs");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "graphs"),
              )
              .executeTakeFirstOrThrow();

            const parents = body?.relations?.parents ? await GetParents({ db, id: params.id, table_name: "graphs" }) : [];
            const finalData: typeof data & { parents?: any[]; edges?: any[] } = { ...data };

            if (parents.length) {
              finalData.parents = parents;
            }

            return {
              data: finalData,
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          },
          {
            body: ReadGraphSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_graphs"),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("graphs", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                if (body.data) {
                  await tx.updateTable("graphs").where("id", "=", params.id).set(body.data).executeTakeFirstOrThrow();
                }
                if (body?.relations) {
                  if (body.relations?.tags)
                    await UpdateTagRelations({
                      relationalTable: "_graphsTotags",
                      id: params.id,
                      newTags: body.relations.tags,
                      tx,
                    });
                }
                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, "graph_permissions", body.permissions);
                }
              });

              return { message: `Graph ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateGraphSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_graphs"),
          },
        )
        .post(
          "/generate",
          async ({ body, permissions }) => {
            let graphId = "";
            await db.transaction().execute(async (tx) => {
              const { id } = await tx
                .insertInto("graphs")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();
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
                const formattedEdges = uniqBy(
                  edges.map((e) => {
                    e.data.source_id = nodeIdDict[e.data.source_id];
                    e.data.target_id = nodeIdDict[e.data.target_id];
                    return e;
                  }),
                  (edge) => `${edge.data.source_id}${edge.data.target_id}`,
                );
                await tx
                  .insertInto("edges")
                  .values(formattedEdges.map((e) => ({ ...e.data, parent_id: id })))
                  .execute();
              }
            });
            return { message: `Graph ${MessageEnum.successfully_created}`, ok: true, role_access: true, data: { id: graphId } };
          },
          {
            body: GenerateGraphSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_graphs"),
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("graphs", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("graphs")
                .where("graphs.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Graph ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_graphs"),
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("graphs", params.id, permissions);
            if (permissionCheck) {
              const data = await db
                .deleteFrom("graphs")
                .where("graphs.id", "=", params.id)
                .where("graphs.deleted_at", "is not", null)
                .returning(["id", "title", "project_id"])
                .executeTakeFirstOrThrow();

              return { data, message: `Graph ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { data: {}, message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_graphs"),
          },
        ),
    );
}
