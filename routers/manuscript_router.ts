import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission } from "../database/queries";
import { InsertManuscriptSchema, ListManuscriptSchema, ReadManuscriptSchema } from "../database/validation/manuscripts";
import { MessageEnum } from "../enums";
import { beforeRoleHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/utils";

export function manuscript_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/manuscripts", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const manuscript = await tx
                .insertInto("manuscripts")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body.relations?.documents?.length) {
                tx.insertInto("manuscript_trees").values(
                  body.relations.documents.map((doc) => ({
                    manuscript_id: manuscript.id,
                    doc_id: doc.doc_id,
                    parent_id: doc.parent_id,
                  })),
                );
              }

              if (body.relations?.tags?.length) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "manuscript_tags", id: manuscript.id, tags });
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, manuscript.id, body.permissions);
              }
            });

            return { ok: true, role_access: true, message: `Manuscript ${MessageEnum.successfully_created}` };
          },
          {
            body: InsertManuscriptSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("manuscripts")
              .select(body.fields.map((f) => `manuscripts.${f}`) as SelectExpression<DB, "manuscripts">[])
              .distinctOn(
                body.orderBy?.length
                  ? (["manuscripts.id", ...body.orderBy.map((order) => order.field)] as any)
                  : "manuscripts.id",
              )
              .where("manuscripts.project_id", "=", body?.data?.project_id)
              .where("manuscripts.deleted_at", body.arkived ? "is not" : "is", null)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

            if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
              query = query.select((eb) =>
                TagQuery(eb, "manuscript_tags", "manuscripts", permissions.is_project_owner, permissions.user_id),
              );
            }
            if (body.orderBy) {
              query = constructOrdering(body.orderBy, query);
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "manuscripts");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "manuscripts");
            }

            const data = await query.execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListManuscriptSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_manuscripts"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            let query = db
              .selectFrom("manuscripts")
              .where("manuscripts.id", "=", params.id)
              .select(body.fields.map((f) => `manuscripts.${f}`) as SelectExpression<DB, "manuscripts">[]);
            if (body?.relations) {
              if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
                query = query.select((eb) =>
                  TagQuery(eb, "manuscript_tags", "manuscripts", permissions.is_project_owner, permissions.user_id),
                );
              }
            }

            if (permissions.is_project_owner) {
              query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
            } else {
              query = checkEntityLevelPermission(query, permissions, "manuscripts", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "manuscripts", params.id);
            }

            const data = await query.executeTakeFirst();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadManuscriptSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        ),
    );
}
