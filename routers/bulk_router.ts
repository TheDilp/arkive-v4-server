import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";
import uniq from "lodash.uniq";

import { db } from "../database/db";
import { DBKeys } from "../database/types";
import {
  InsertNodeSchema,
  InsertRandomTableOptionItemSchema,
  UpdateEdgeSchema,
  UpdateEventSchema,
  UpdateNodeSchema,
} from "../database/validation";
import { BulkUpdateAccess } from "../database/validation/bulk";
import { BulkArkiveEntitiesEnum, BulkDeleteEntitiesEnum, newTagTables } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler, beforeRoleHandler } from "../handlers";
import {
  AvailableEntityType,
  AvailablePermissions,
  AvailableSubEntityType,
  BulkArkiveEntitiesType,
  BulkDeleteEntitiesType,
  PublicEntities,
} from "../types/entityTypes";
import { PermissionDecorationType, ResponseSchema } from "../types/requestTypes";
import { UpdateTagRelations } from "../utils/relationalQueryHelpers";
import { getEntityTagTable } from "../utils/requestUtils";
import { s3Client } from "../utils/s3Utils";

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
          beforeHandle: async (context) => beforeRoleHandler(context, `create_${context.params.type}` as AvailablePermissions),
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
          beforeHandle: async (context) => beforeRoleHandler(context, `update_${context.params.type}` as AvailablePermissions),
        },
      )
      .post(
        "/update/:type",
        async ({ params, body, permissions }) => {
          db.transaction().execute(async (tx) => {
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

            const ids = permissions.is_project_owner ? sent_ids : d.map((item) => item.id);

            if (ids.length)
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

            if (params.type === "nodes") {
              const nodesWithTagsToUpdate = body.data.filter((n) => !!n?.relations?.tags);
              if (nodesWithTagsToUpdate.length)
                await Promise.all(
                  nodesWithTagsToUpdate.map((n) =>
                    UpdateTagRelations({
                      relationalTable: "_nodesTotags",
                      id: n.data.id,
                      newTags: n.relations?.tags as { id: string }[],
                      tx,
                      is_project_owner: permissions.is_project_owner,
                    }),
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
            }
          });

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: t.Object({ data: t.Array(t.Union([UpdateEventSchema, UpdateNodeSchema, UpdateEdgeSchema])) }),
          response: ResponseSchema,
          beforeHandle: async (context) =>
            beforeRoleHandler(
              context,
              `update_${
                context.params.type === "nodes" || context.params.type === "edges" ? "graphs" : context.params.type
              }` as AvailablePermissions,
            ),
        },
      )
      .post(
        "/update/access/:type",
        async ({ params, body, permissions }) => {
          const relatedIds = uniq(body.data.permissions.map((p) => p.related_id));

          const sent_ids = relatedIds;

          const d = await db

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

          const ids = permissions.is_project_owner ? sent_ids : d.map((item) => item.id);

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

                // @ts-ignore
                tx.deleteFrom("entity_permissions").where("related_id", "in", ids).execute();

                if (userPermissions.length) {
                  // @ts-ignore
                  tx.insertInto("entity_permissions")
                    .values(userPermissions)
                    .onConflict((oc) => oc.doNothing())
                    .execute();
                }
                if (rolePermissions.length) {
                  // @ts-ignore
                  tx.insertInto("entity_permissions")
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
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
          body: BulkUpdateAccess,
          response: ResponseSchema,
        },
      )
      .post(
        "/tags/:type",
        async ({ params, body }) => {
          const entityTagTable = getEntityTagTable(params.type as AvailableEntityType | AvailableSubEntityType);
          if (entityTagTable) {
            await db.transaction().execute(async (tx) => {
              if (body.data.add.length)
                await tx
                  .insertInto(entityTagTable)
                  .values(
                    newTagTables.includes(entityTagTable)
                      ? body.data.add.map((t) => ({ related_id: t.A, tag_id: t.B }))
                      : body.data.add,
                  )
                  .execute();
              if (body.data.remove.length)
                await tx
                  .deleteFrom(entityTagTable)
                  .where((eb) =>
                    eb.or(
                      body.data.remove.map((r) =>
                        eb.and([
                          eb(newTagTables.includes(entityTagTable) ? "related_id" : "A", "=", r.A),
                          eb(newTagTables.includes(entityTagTable) ? "tag_id" : "B", "=", r.B),
                        ]),
                      ),
                    ),
                  )
                  .execute();
            });
          }
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
          beforeHandle: async (context) => beforeRoleHandler(context, `update_${context.params.type}` as AvailablePermissions),
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
                .updateTable(params.type as BulkArkiveEntitiesType)
                .set(
                  params.type === "characteres" ||
                    params.type === "tags" ||
                    params.type === "blueprints" ||
                    params.type === "character_fields_templates"
                    ? { deleted_at: new Date().toUTCString() }
                    : // @ts-ignore
                      { deleted_at: new Date().toUTCString(), is_public: false },
                )
                .where("id", "in", ids)
                .execute();
            }
          }
          return {
            message: `Many ${params.type.replaceAll("_", " ")} ${MessageEnum.successfully_deleted}`,
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
          beforeHandle: async (context) => beforeRoleHandler(context, `delete_${context.params.type}` as AvailablePermissions),
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
            if (params.type === "images" && !body.data.project_id) {
              console.error("ATTEMPTED BULK DELETE FOR IMAGES WITH NO PROJECT ID", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && body.data.project_id) {
              const sent_ids = body.data.ids;

              const d = await db

                // @ts-ignore
                .selectFrom(params.type as DBKeys)
                // @ts-ignore
                .select([`${params.type}.id`])
                // @ts-ignore
                .leftJoin("entity_permissions", "entity_permissions.related_id", `${params.type}.id`)
                .leftJoin("permissions", "permissions.id", "entity_permissions.permission_id")
                // @ts-ignore
                .where(`${params.type}.id`, "in", sent_ids)
                .where("permissions.code", "like", `delete_${params.type}`)
                .where("entity_permissions.user_id", "=", permissions.user_id)
                .execute();

              const ids = permissions.is_project_owner ? sent_ids : d.map((item) => item.id);

              try {
                const filePath = `assets/${body.data.project_id}/${params.type}`;
                const deleteCommand = new DeleteObjectsCommand({
                  Bucket: process.env.DO_SPACES_NAME as string,
                  Delete: {
                    Objects: (ids || []).map((id) => ({ Key: `${filePath}/${id}.webp` })),
                    Quiet: false,
                  },
                });
                await s3Client.send(deleteCommand);
                await db
                  .deleteFrom(params.type as BulkDeleteEntitiesType)
                  .where("id", "in", ids)
                  .execute();
              } catch (error) {
                console.error("ERROR BULK DELETING S3 IMAGES ");
                throw new Error("INTERNAL_SERVER_ERROR");
              }
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
          return {
            message: `Many ${params.type.replaceAll("_", " ")} ${MessageEnum.successfully_deleted}`,
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
          beforeHandle: async (context) => beforeRoleHandler(context, `delete_${context.params.type}` as AvailablePermissions),
        },
      ),
  );
}
