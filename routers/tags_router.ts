import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getAllProjectTags, getHasEntityPermission } from "../database/queries";
import { EntityListSchema, InsertTagSchema, UpdateTagSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, RequestBodySchema, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { redisClient } from "../utils/redisClient";
import {
  CreateEntityPermissions,
  GetRelatedEntityPermissionsAndRoles,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntitiesWithOwnerId, getEntityWithOwnerId } from "../utils/utils";

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
          const tags_data = await db.transaction().execute(async (tx) => {
            if (permissions.project_id) {
              const tags = await tx
                .insertInto("tags")
                .values(
                  Array.isArray(body.data)
                    ? getEntitiesWithOwnerId(
                        body.data.map((tag) => ({ ...tag, project_id: permissions.project_id as string })),
                        permissions.user_id,
                      )
                    : getEntityWithOwnerId({ ...body.data, project_id: permissions.project_id }, permissions.user_id),
                )
                .returning(["id", "title", "color", "project_id"])
                .execute();

              if (body.permissions?.length) {
                await Promise.all(tags.map((t) => CreateEntityPermissions(tx, t.id, body.permissions)));
              }
              return tags;
            }
            return [];
          });
          const redis = await redisClient;
          redis.DEL(`${permissions.project_id}-all_tags`);

          return { data: tags_data, message: `Tags ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertTagSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          let query = db
            .selectFrom("tags")
            .where("tags.project_id", "=", permissions.project_id)
            .where("tags.deleted_at", body.arkived ? "is not" : "is", null)
            .select(body.fields.map((f) => `tags.${f}`) as SelectExpression<DB, "tags">[]);
          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("tags", query, body.filters);
          }
          query = query
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }
          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "tags");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "tags");
          }

          const data = await query.execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/all",
        async ({ permissions }) => {
          if (!permissions.project_id)
            return { data: [], ok: false, role_access: true, message: "There was an error with your request." };
          const redis = await redisClient;
          const all_tags = await redis.get(`${permissions.project_id}-all_tags`);
          if (all_tags) {
            try {
              const data = JSON.parse(all_tags);
              return { data, ok: true, role_access: true, message: MessageEnum.success };
            } catch (error) {
              console.error(`Could not parse cached tags for project - ${permissions.project_id}`);
              const fetchedTags = await getAllProjectTags(permissions.project_id, permissions);

              // Cache tags
              redis.SET(`${permissions.project_id}-all_tags`, JSON.stringify(fetchedTags), { EX: 24 * 60 * 60 });
              return { data: fetchedTags, ok: true, role_access: true, message: MessageEnum.success };
            }
          } else {
            // Fetch only if no cached tags available
            const fetchedTags = await getAllProjectTags(permissions.project_id, permissions);
            // Cache tags
            redis.SET(`${permissions.project_id}-all_tags`, JSON.stringify(fetchedTags), { EX: 24 * 60 * 60 });
            return { data: fetchedTags, ok: true, role_access: true, message: MessageEnum.success };
          }
        },
        {
          response: ResponseWithDataSchema,
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
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("tags", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("tags").where("id", "=", params.id).set(body.data).execute();

              if (body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, body.permissions);
              }
            });

            const redis = await redisClient;
            redis.DEL(`${permissions.project_id}-all_tags`);
            return { message: `Tag ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          body: UpdateTagSchema,
          response: ResponseSchema,
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

            const redis = await redisClient;
            redis.DEL(`${permissions.project_id}-all_tags`);

            return { message: `Tag ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params, permissions }) => {
          const data = await db
            .deleteFrom("tags")
            .where("tags.id", "=", params.id)
            .where("tags.deleted_at", "is not", null)
            .returning(["tags.id", "tags.title", "tags.project_id"])
            .executeTakeFirstOrThrow();

          const redis = await redisClient;
          redis.DEL(`${permissions.project_id}-all_tags`);

          return { data, message: `Tag ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
