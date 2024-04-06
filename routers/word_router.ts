import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { InserWordSchema, ListWordSchema, ReadWordSchema, UpdateWordSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  GetRelatedEntityPermissionsAndRoles,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

export function word_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/words", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("dictionaries")
              .select(["project_id"])
              .where("id", "=", body.data.parent_id)
              .executeTakeFirstOrThrow();
            await db.transaction().execute(async (tx) => {
              const word = await tx
                .insertInto("words")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, word.id, "word_permissions", body.permissions);
              }
            });

            return {
              data: { title: body.data.title, project_id: data.project_id },
              ok: true,
              role_access: true,
              message: `Word ${MessageEnum.successfully_created}`,
            };
          },
          {
            body: InserWordSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_words"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("words")
              .distinctOn(
                body.orderBy?.length
                  ? (["words.id", ...body.orderBy.map((order) => `words.${order.field}`)] as any)
                  : "words.id",
              )
              .select(body.fields.map((f) => `words.${f}`) as SelectExpression<DB, "words">[])
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .where("words.parent_id", "=", body.data.parent_id);

            if (body.orderBy?.length) {
              query = constructOrdering(body.orderBy, query);
            }
            if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
              query = constructFilter("words", query, body.filters);
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "words");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "words");
            }

            const data = await query.execute();
            return { data, ok: true, role_access: true, message: MessageEnum.success };
          },
          {
            body: ListWordSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_words"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            let query = db
              .selectFrom("words")
              .where("words.id", "=", params.id)
              .select(body.fields.map((f) => `words.${f}`) as SelectExpression<DB, "words">[]);

            if (permissions.is_project_owner) {
              query = query.leftJoin("word_permissions", (join) => join.on("word_permissions.related_id", "=", params.id));
            } else {
              query = checkEntityLevelPermission(query, permissions, "words", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "words", params.id);
            }

            const data = await query.executeTakeFirst();
            return { data, ok: true, role_access: true, message: MessageEnum.success };
          },
          {
            body: ReadWordSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_words"),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("words", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                await tx.updateTable("words").where("words.id", "=", params.id).set(body.data).execute();

                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, "word_permissions", body.permissions);
                }
              });
              return { message: `Word ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateWordSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_words"),
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("words", params.id, permissions);
            if (permissionCheck) {
              const res = await db
                .deleteFrom("words")
                .where("words.id", "=", params.id)
                .returning(["words.parent_id", "words.title"])
                .executeTakeFirstOrThrow();

              const data = await db
                .selectFrom("dictionaries")
                .where("id", "=", res.parent_id)
                .select(["project_id"])
                .executeTakeFirstOrThrow();

              return { data, message: `Word ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { data: {}, message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_words"),
          },
        ),
    );
}
