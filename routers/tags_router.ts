import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntityListSchema, InsertTagSchema, UpdateTagSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, RequestBodySchema, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  GetRelatedEntityPermissionsAndRoles,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntitiesWithOwnerId, getEntityWithOwnerId } from "../utils/transform";

export function tag_router(app: Elysia) {
  return app.group("/tags", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
      } as PermissionDecorationType)
      .post(
        "/create",
        async ({ body, permissions }) => {
          await db.transaction().execute(async (tx) => {
            const tag = await tx
              .insertInto("tags")
              .values(
                Array.isArray(body.data)
                  ? getEntitiesWithOwnerId(body.data, permissions.user_id)
                  : getEntityWithOwnerId(body.data, permissions.user_id),
              )
              .returning("id")
              .execute();

            if (body.permissions?.length) {
              await Promise.all(tag.map((t) => CreateEntityPermissions(tx, t.id, body.permissions)));
            }
          });
          return { message: `Tags ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertTagSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "create_tags"),
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          const data = await db
            .selectFrom("tags")
            .where("tags.project_id", "=", body.data.project_id)
            .where("tags.deleted_at", body.arkived ? "is not" : "is", null)
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("tags", qb, body.filters);
              return qb;
            })
            .select(body.fields.map((f) => `tags.${f}`) as SelectExpression<DB, "tags">[])
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "tags");
            })
            .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
              GetRelatedEntityPermissionsAndRoles(qb, permissions, "tags"),
            )
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_tags"),
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          let query = db.selectFrom("tags").distinctOn("tags.id").where("tags.id", "=", params.id);

          if (permissions.is_project_owner) {
            query = query
              .leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id))
              .select(["tags.id", "tags.title", "tags.color"]);
          } else {
            query = checkEntityLevelPermission(query, permissions, "tags", params.id);
          }

          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "tags", params.id);
          }

          const data = await query.executeTakeFirst();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: RequestBodySchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_tags"),
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            await tx.updateTable("tags").where("id", "=", params.id).set(body.data).execute();

            if (body?.permissions) {
              await UpdateEntityPermissions(tx, params.id, body.permissions);
            }
          });

          return { message: `Tag ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        {
          body: UpdateTagSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "update_tags"),
        },
      )
      .delete(
        "/arkive/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("tags", params.id, permissions);

          if (permissionCheck) {
            await db
              .updateTable("tags")
              .where("tags.id", "=", params.id)
              .set({ deleted_at: new Date().toUTCString() })
              .execute();

            return { message: `Tag ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "delete_tags"),
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          const data = await db
            .deleteFrom("tags")
            .where("tags.id", "=", params.id)
            .where("tags.deleted_at", "is not", null)
            .returning(["tags.id", "tags.title", "tags.project_id"])
            .executeTakeFirstOrThrow();
          return { data, message: `Tag ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "delete_tags"),
        },
      ),
  );
}
