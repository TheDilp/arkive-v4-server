import { Elysia, t } from "elysia";
import { ReferenceExpression, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";
import uniq from "lodash.uniq";

import { db } from "../database/db";
import { checkEntityLevelPermission } from "../database/queries";
import { DBKeys } from "../database/types";
import { InsertNodeSchema, InsertRandomTableOptionItemSchema } from "../database/validation";
import { BulkUpdateAccess } from "../database/validation/bulk";
import { BulkArkiveEntitiesEnum, BulkDeleteEntitiesEnum, newTagTables } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import {
  AvailableEntityType,
  AvailableSubEntityType,
  BulkArkiveEntitiesType,
  BulkDeleteEntitiesType,
  PublicEntities,
} from "../types/entityTypes";
import { PermissionDecorationType, ResponseSchema } from "../types/requestTypes";
import { redisClient } from "../utils/redisClient";
import { UpdateTagRelations } from "../utils/relationalQueryHelpers";
import { getEntityTagTable } from "../utils/requestUtils";

export function bulk_router(app: Elysia) {
  return app.group("/bulk", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
        all_permissions: {},
      } as PermissionDecorationType)
      .post(
        "/create/:type",
        async ({ params, body }) => {
          db.insertInto(params.type as DBKeys)
            .values(body.data.map((item) => item.data))
            .execute();

          return { ok: true, message: `Nodes ${MessageEnum.successfully_created}`, role_access: true };
        },
        {
          body: t.Object({ data: t.Array(t.Union([InsertNodeSchema, t.Object({ data: InsertRandomTableOptionItemSchema })])) }),
          response: ResponseSchema,
        },
      )
      .post(
        "/update/public/:type",
        async ({ params, body }) => {
          await db
            .updateTable(params.type as PublicEntities)
            .set({ is_public: body.data.is_public })
            .where("id", "in", body.data.ids)
            .execute();

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: t.Object({ data: t.Object({ ids: t.Array(t.String()), is_public: t.Boolean() }) }),
          response: ResponseSchema,
        },
      )
      .post(
        "/update/:type",
        async ({ params, body, permissions }) => {
          await db.transaction().execute(async (tx) => {
            const sent_ids = body.data.map((item) => item.data.id);
            const d = await db

              // @ts-ignore
              .selectFrom(params.type as DBKeys)
              .select([`${params.type}.id`] as SelectExpression<DB, DBKeys>[])
              // @ts-ignore
              .leftJoin("entity_permissions", "entity_permissions.related_id", `${params.type}.id`)
              .leftJoin("permissions", "permissions.id", "entity_permissions.permission_id")
              // @ts-ignore
              .where(`${params.type}.id`, "in", sent_ids)
              .where("permissions.code", "like", `update_${params.type}`)
              .where("entity_permissions.user_id", "=", permissions.user_id)
              .execute();

            if (params.type === "nodes") {
              const nodesWithTagsToUpdate = body.data.filter((n) => !!n?.relations?.tags);
              if (nodesWithTagsToUpdate.length)
                await Promise.all(
                  nodesWithTagsToUpdate
                    .map((n) =>
                      UpdateTagRelations({
                        relationalTable: "_nodesTotags",
                        id: n.data.id,
                        newTags: n.relations?.tags as { id: string }[],
                        tx,
                        is_project_owner: permissions.is_project_owner,
                      }),
                    )
                    .concat(
                      body.data.map((node) =>
                        tx.updateTable("nodes").where("id", "=", node.data.id).set(omit(node.data, "id")).execute(),
                      ),
                    ),
                );
            } else if (params.type === "edges") {
              const edgesWithTagsToUpdate = body.data.filter((n) => !!n?.relations?.tags);
              if (edgesWithTagsToUpdate.length)
                await Promise.all(
                  edgesWithTagsToUpdate.map((e) =>
                    UpdateTagRelations({
                      relationalTable: "_edgesTotags",
                      id: e.data.id,
                      newTags: e.relations?.tags as { id: string }[],
                      tx,
                      is_project_owner: permissions.is_project_owner,
                    }),
                  ),
                );
            } else {
              const ids = permissions.is_project_owner ? sent_ids : d.map((item) => item.id);
              await Promise.all(
                body.data
                  .filter((item) => ids.includes(item.data.id))
                  .map((item) =>
                    tx

                      .updateTable(params.type as DBKeys)
                      // @ts-ignore
                      .set(omit(item.data, "id"))
                      .where("id", "in", ids)
                      .execute(),
                  ),
              );
            }
          });
          const redis = await redisClient;

          if (redis) redis.del(`${permissions.project_id}_${permissions.user_id}_stats`);

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: t.Object({
            data: t.Array(
              t.Intersect([
                t.Record(t.Literal("data"), t.Record(t.String(), t.Any())),
                t.Object({
                  relations: t.Optional(t.Record(t.String(), t.Any())),
                }),
              ]),
            ),
          }),
          response: ResponseSchema,
        },
      )
      .post(
        "/update/access/:type",
        async ({ params, body, permissions }) => {
          const relatedIds = uniq(body.data.permissions.map((p) => p.related_id));
          const sent_ids = relatedIds;
          const ids: string[] = [];
          if (permissions.is_project_owner) {
            for (let index = 0; index < sent_ids.length; index++) {
              ids.push(sent_ids[index]);
            }
          } else {
            const permitted_ids = await db

              // @ts-ignore
              .selectFrom(params.type as DBKeys)
              .select([`${params.type}.id`] as SelectExpression<DB, DBKeys>[])
              // @ts-ignore
              .leftJoin("entity_permissions", "entity_permissions.related_id", `${params.type}.id`)
              .leftJoin("permissions", "permissions.id", "entity_permissions.permission_id")
              // @ts-ignore
              .where(`${params.type}.id`, "in", sent_ids)
              // @ts-ignore
              .where((wb) => wb(`${params.type}.owner_id`, "=", permissions.user_id))
              .execute();

            for (let index = 0; index < permitted_ids.length; index++) {
              ids.push(permitted_ids[index].id);
            }
          }
          if (ids.length) {
            // If there is an entry with actual permission changes
            if (body.data.permissions.some((p) => !!p.permission_id || !!p.role_id || !!p.permission_id)) {
              await db.transaction().execute(async (tx) => {
                const userPermissions = body.data.permissions.filter(
                  (perm) => !!perm.user_id && ids.includes(perm.related_id),
                ) as {
                  related_id: string;
                  user_id: string;
                  permission_id: string;
                }[];
                const rolePermissions = body.data.permissions.filter(
                  (perm) => !!perm.role_id && ids.includes(perm.related_id),
                ) as {
                  related_id: string;
                  role_id: string;
                }[];

                await tx.deleteFrom("entity_permissions").where("related_id", "in", ids).execute();
                if (userPermissions.length) {
                  await tx
                    .insertInto("entity_permissions")
                    .values(userPermissions)
                    .onConflict((oc) => oc.doNothing())
                    .execute();
                }
                if (rolePermissions.length) {
                  await tx
                    .insertInto("entity_permissions")
                    .values(rolePermissions)
                    .onConflict((oc) => oc.doNothing())
                    .execute();
                }
              });
            }
            // Everything is empty for the related enteties
            // !Do not remove and place before IF statement
            // !The other delete needs to be within a transaction
            // !in case of failure
            else {
              // @ts-ignore
              await db.deleteFrom("entity_permissions").where("related_id", "in", ids).execute();
            }
          }

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: BulkUpdateAccess,
          response: ResponseSchema,
        },
      )
      .post(
        "/tags/:type",
        async ({ params, body, permissions }) => {
          const entityTagTable = getEntityTagTable(params.type as AvailableEntityType | AvailableSubEntityType);
          const entity_ids = Array.from(new Set([body.data.add, body.data.remove].flat().map((i) => i.A)));
          const permittedEntities: string[] = [];

          if (permissions.is_project_owner) {
            for (let index = 0; index < entity_ids.length; index++) {
              permittedEntities.push(entity_ids[index]);
            }
          } else {
            const entities = await db
              .selectFrom(
                params.type as "manuscripts" | "characters" | "documents" | "maps" | "graphs" | "calendars" | "dictionaries",
              )
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(
                  qb,
                  permissions,
                  params.type as "manuscripts" | "characters" | "documents" | "maps" | "graphs" | "calendars" | "dictionaries",
                );
              })
              .select("id")
              .where("id", "in", entity_ids)
              .execute();

            for (let index = 0; index < entities.length; index++) {
              permittedEntities.push(entities[index].id);
            }
          }

          if (entityTagTable && permittedEntities.length) {
            await db.transaction().execute(async (tx) => {
              const toAdd = permissions.is_project_owner
                ? body.data.add
                : body.data.add.filter((item) => permittedEntities.includes(item.A));

              const toRemove = permissions.is_project_owner
                ? body.data.remove
                : body.data.remove.filter((item) => permittedEntities.includes(item.A));
              const actions = [];

              if (toAdd.length) {
                actions.push(
                  tx
                    .insertInto(entityTagTable)
                    .values(
                      newTagTables.includes(entityTagTable) ? toAdd.map((t) => ({ related_id: t.A, tag_id: t.B })) : toAdd,
                    )
                    .execute(),
                );
              }
              if (toRemove.length) {
                actions.push(
                  tx
                    .deleteFrom(entityTagTable)
                    .where((eb) =>
                      eb.or(
                        toRemove.map((r) =>
                          eb.and([
                            eb(newTagTables.includes(entityTagTable) ? "related_id" : "A", "=", r.A),
                            eb(newTagTables.includes(entityTagTable) ? "tag_id" : "B", "=", r.B),
                          ]),
                        ),
                      ),
                    )
                    .execute(),
                );
              }
              await Promise.all([actions]);
            });
          }

          const redis = await redisClient;

          if (redis) redis.del(`${permissions.project_id}_${permissions.user_id}_stats`);

          return { ok: true, message: MessageEnum.success, role_access: true };
        },
        {
          body: t.Object({
            data: t.Object({
              add: t.Array(t.Object({ A: t.String(), B: t.String() })),
              remove: t.Array(t.Object({ A: t.String(), B: t.String() })),
            }),
          }),
          response: ResponseSchema,
        },
      )
      .delete(
        "/arkive/:type",
        async ({ params, body, permissions }) => {
          if (params.type) {
            if (!BulkArkiveEntitiesEnum.includes(params.type)) {
              console.error("ATTEMPTED BULK ARKIVE WITH UNALLOWED TYPE", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }

            if (BulkArkiveEntitiesEnum.includes(params.type) && params.type !== "images") {
              const sent_ids = body.data.ids;
              const ids = [];

              if (permissions.is_project_owner) {
                for (let index = 0; index < sent_ids.length; index++) {
                  ids.push(sent_ids[index]);
                }
              } else {
                const permitted_ids = await db

                  // @ts-ignore
                  .selectFrom(params.type as DBKeys)
                  .select([`${params.type}.id`] as SelectExpression<DB, DBKeys>[])
                  // @ts-ignore
                  .leftJoin("entity_permissions", "entity_permissions.related_id", `${params.type}.id`)
                  .leftJoin("permissions", "permissions.id", "entity_permissions.permission_id")
                  // @ts-ignore
                  .where(`${params.type}.id`, "in", sent_ids)
                  .where("permissions.code", "like", `delete_${params.type}`)
                  .where("entity_permissions.user_id", "=", permissions.user_id)
                  .execute();

                for (let index = 0; index < permitted_ids.length; index++) {
                  ids.push(permitted_ids[index]);
                }
              }
              if (ids.length) {
                await db
                  .updateTable(params.type as BulkArkiveEntitiesType)
                  .set(
                    params.type === "characters" ||
                      params.type === "tags" ||
                      params.type === "blueprints" ||
                      params.type === "character_fields_templates"
                      ? { deleted_at: new Date().toUTCString() }
                      : // @ts-ignore
                        { deleted_at: new Date().toUTCString(), is_public: false },
                  )
                  .where(`${params.type}.id` as ReferenceExpression<DB, BulkArkiveEntitiesType>, "in", ids)
                  .execute();
              }
            }
          }
          const redis = await redisClient;

          if (redis) {
            redis.del(`${permissions.project_id}_${permissions.user_id}_stats`);

            if (params.type === "tags") {
              redis.DEL(`${permissions.project_id}-all_tags`);
            }
          }
          return {
            message: `Many ${params.type.replaceAll("_", " ")} ${MessageEnum.successfully_arkived}`,
            ok: true,
            role_access: true,
          };
        },
        {
          body: t.Object({
            data: t.Object({
              ids: t.Array(t.String(), { minItems: 1, maxItems: 100 }),
              project_id: t.Optional(t.String()),
            }),
          }),
          response: ResponseSchema,
        },
      )
      .delete(
        "/delete/:type",
        async ({ params, body, permissions }) => {
          if (params.type) {
            if (!BulkDeleteEntitiesEnum.includes(params.type)) {
              console.error("ATTEMPTED BULK DELETE WITH UNALLOWED TYPE", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && !permissions.project_id) {
              console.error("ATTEMPTED BULK DELETE FOR IMAGES WITH NO PROJECT ID", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }

            if (BulkDeleteEntitiesEnum.includes(params.type)) {
              const sent_ids = body.data.ids;

              const d = await db

                // @ts-ignore
                .selectFrom(params.type as DBKeys)
                .select([`${params.type}.id`] as SelectExpression<DB, DBKeys>[])
                // @ts-ignore
                .leftJoin("entity_permissions", "entity_permissions.related_id", `${params.type}.id`)
                .leftJoin("permissions", "permissions.id", "entity_permissions.permission_id")
                // @ts-ignore
                .where(`${params.type}.id`, "in", sent_ids)
                .where("permissions.code", "like", `delete_${params.type}`)
                .where("entity_permissions.user_id", "=", permissions.user_id)
                .execute();

              const ids = permissions.is_project_owner ? sent_ids : d.map((item) => item.id);

              await db
                .deleteFrom(params.type as BulkDeleteEntitiesType)
                .where("id", "in", ids)
                .execute();
            }
          }
          const redis = await redisClient;

          if (redis) {
            redis.del(`${permissions.project_id}_${permissions.user_id}_stats`);

            if (params.type === "tags") {
              redis.DEL(`${permissions.project_id}-all_tags`);
            }
          }
          return {
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        {
          body: t.Object({
            data: t.Object({
              ids: t.Array(t.String(), { minItems: 1, maxItems: 100 }),
              project_id: t.Optional(t.String()),
            }),
          }),
          response: ResponseSchema,
        },
      ),
  );
}
