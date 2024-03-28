import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import Elysia, { t } from "elysia";
import uniq from "lodash.uniq";

import { db } from "../database/db";
import {
  InsertNodeSchema,
  InsertRandomTableOptionItemSchema,
  UpdateEdgeSchema,
  UpdateEventSchema,
  UpdateNodeSchema,
} from "../database/validation";
import { BulkUpdateAccess } from "../database/validation/bulk";
import { BulkDeleteEntities } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler, beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import {
  AvailableEntityType,
  AvailableSubEntityType,
  BulkDeleteEntitiesType,
  EntitiesWithPermissionCheck,
  PublicEntities,
} from "../types/entityTypes";
import { ResponseSchema } from "../types/requestTypes";
import { UpdateTagRelations } from "../utils/relationalQueryHelpers";
import { getEntityTagTable, getPermissionFromAction, getPermissionTableFromEntity } from "../utils/requestUtils";
import { s3Client } from "../utils/s3Utils";

export function bulk_router(app: Elysia) {
  return app.group("/bulk", (server) =>
    server
      .post(
        "/create/:type",
        async ({ params, body }) => {
          db.insertInto(params.type as AvailableEntityType | AvailableSubEntityType)
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
          beforeHandle: async (context) => {
            const permission = getPermissionFromAction(
              "update",
              context.params.type as AvailableEntityType | AvailableSubEntityType | "assets",
            );
            if (permission) {
              return beforeRoleHandler(context, permission);
            } else {
              noRoleAccessErrorHandler();
            }
          },
        },
      )
      .post(
        "/update/:type",
        async ({ params, body }) => {
          db.transaction().execute(async (tx) => {
            await Promise.all(
              body.data.map((item) =>
                tx
                  .updateTable(params.type as AvailableEntityType | AvailableSubEntityType)
                  .set(item.data)
                  .where("id", "=", item.data.id)
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
          beforeHandle: async (context) => {
            const permission = getPermissionFromAction(
              "update",
              context.params.type as AvailableEntityType | AvailableSubEntityType | "assets",
            );
            if (permission) {
              return beforeRoleHandler(context, permission);
            } else {
              noRoleAccessErrorHandler();
            }
          },
        },
      )
      .post(
        "/update/access/:type",
        async ({ params, body }) => {
          const permissionsTable = getPermissionTableFromEntity(params.type as EntitiesWithPermissionCheck);

          if (permissionsTable) {
            const relatedIds = uniq(body.data.permissions.map((p) => p.related_id));

            // If there is an entry with actual permission changes
            if (body.data.permissions.some((p) => !!p.permission_id || !!p.role_id || !!p.permission_id)) {
              await db.transaction().execute(async (tx) => {
                const userPermissions = body.data.permissions.filter((perm) => !!perm.user_id) as {
                  related_id: string;
                  user_id: string;
                  permission_id: string;
                }[];
                const rolePermissions = body.data.permissions.filter((perm) => !!perm.role_id) as {
                  related_id: string;
                  role_id: string;
                }[];

                // @ts-ignore
                tx.deleteFrom(permissionsTable).where("related_id", "in", relatedIds).execute();

                if (userPermissions.length) {
                  // @ts-ignore
                  tx.insertInto(permissionsTable)
                    .values(userPermissions)
                    .onConflict((oc) => oc.doNothing())
                    .execute();
                }
                if (rolePermissions.length) {
                  // @ts-ignore
                  tx.insertInto(permissionsTable)
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
              await db.deleteFrom(permissionsTable).where("related_id", "in", relatedIds).execute();
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
              if (body.data.add.length) await tx.insertInto(entityTagTable).values(body.data.add).execute();
              if (body.data.remove.length)
                await tx
                  .deleteFrom(entityTagTable)
                  .where((eb) => eb.or(body.data.remove.map((r) => eb.and([eb("A", "=", r.A), eb("B", "=", r.B)]))))
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
          beforeHandle: async (context) => {
            const permission = getPermissionFromAction(
              "update",
              context.params.type as AvailableEntityType | AvailableSubEntityType | "assets",
            );
            if (permission) {
              return beforeRoleHandler(context, permission);
            } else {
              noRoleAccessErrorHandler();
            }
          },
        },
      )
      .delete(
        "/delete/:type",
        async ({ params, body }) => {
          if (params.type) {
            if (!BulkDeleteEntities.includes(params.type)) {
              console.error("ATTEMPTED BULK DELETE WITH UNALLOWED TYPE", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && !body.data.project_id) {
              console.error("ATTEMPTED BULK DELETE FOR IMAGES WITH NO PROJECT ID", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && body.data.project_id) {
              try {
                const filePath = `assets/${body.data.project_id}/${params.type}`;
                const deleteCommand = new DeleteObjectsCommand({
                  Bucket: process.env.DO_SPACES_NAME as string,
                  Delete: {
                    Objects: (body.data.ids || []).map((id) => ({ Key: `${filePath}/${id}.webp` })),
                    Quiet: false,
                  },
                });
                await s3Client.send(deleteCommand);
                await db
                  .deleteFrom(params.type as BulkDeleteEntitiesType)
                  .where("id", "in", body.data.ids)
                  .execute();
              } catch (error) {
                console.error("ERROR BULK DELETING S3 IMAGES ");
                throw new Error("INTERNAL_SERVER_ERROR");
              }
            }
            if (BulkDeleteEntities.includes(params.type)) {
              await db
                .deleteFrom(params.type as BulkDeleteEntitiesType)
                .where("id", "in", body.data.ids)
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
          beforeHandle: async (context) => {
            const permission = getPermissionFromAction(
              "delete",
              context.params.type as AvailableEntityType | AvailableSubEntityType | "assets",
            );
            if (permission) {
              return beforeRoleHandler(context, permission);
            } else {
              noRoleAccessErrorHandler();
            }
          },
        },
      ),
  );
}
