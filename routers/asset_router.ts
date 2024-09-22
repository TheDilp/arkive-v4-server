import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission } from "../database/queries";
import { ListAssetsSchema, ReadAssetsSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { AssetType } from "../types/entityTypes";
import { PermissionDecorationType, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelatedEntityPermissionsAndRoles, TagQuery } from "../utils/relationalQueryHelpers";
import { groupRelationFiltersByField } from "../utils/utils";

export function asset_router(app: Elysia) {
  return app.group("/assets", (server) =>
    server
      .decorate("permissions", {
        all_permissions: {},
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
      } as PermissionDecorationType)
      .post(
        "/:type",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("images")
            .where("images.project_id", "=", permissions.project_id)
            .where("images.type", "=", params.type as AssetType)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("images", query, body.filters);
          }
          if (body.fields?.length) {
            query = query.select(body.fields.map((f) => `images.${f}`) as SelectExpression<DB, "images">[]);
          }

          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "images");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "images");
          }
          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }

          if (body?.relations?.tags) {
            query = query.select((eb) =>
              TagQuery(eb, "image_tags", "images", permissions.is_project_owner, permissions.user_id),
            );
          }

          const { tags } = groupRelationFiltersByField(body.relationFilters || {});

          if (tags?.filters?.length) query = tagsRelationFilter("images", "image_tags", query, tags?.filters || [], false);

          const data = await query.execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListAssetsSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:type/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("images")
            .where("images.id", "=", params.id)
            .select(body.fields.map((f) => `images.${f}`) as SelectExpression<DB, "images">[]);

          if (permissions.is_project_owner) {
            query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
          } else {
            query = checkEntityLevelPermission(query, permissions, "images", params.id);
          }
          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "images", params.id);
          }

          if (body?.relations?.tags) {
            query = query.select((eb) =>
              TagQuery(eb, "image_tags", "images", permissions.is_project_owner, permissions.user_id),
            );
          }
          const data = await query.executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadAssetsSchema,
          response: ResponseWithDataSchema,
        },
      ),
  );
}
