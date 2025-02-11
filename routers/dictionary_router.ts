import { Elysia } from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission, getNestedReadPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertDictionarySchema, ReadDictionarySchema, UpdateDictionarySchema } from "../database/validation/dictionaries";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  GetEntityChildren,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/utils";

export function dictionary_router(app: Elysia) {
  return app.group("/dictionaries", (server) =>
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
          const data = await db
            .insertInto("dictionaries")
            .values(getEntityWithOwnerId(body.data, permissions.user_id))
            .returning("id")
            .execute();
          return { data, ok: true, role_access: true, message: `Dictionary ${MessageEnum.successfully_created}` };
        },
        {
          body: InsertDictionarySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          const data = await db
            .selectFrom("dictionaries")
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .select(body.fields.map((f) => `dictionaries.${f}`) as SelectExpression<DB, "dictionaries">[])
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("dictionaries", qb, body.filters);
              return qb;
            })
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "dictionaries");
            })
            .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
              GetRelatedEntityPermissionsAndRoles(qb, permissions, "dictionaries"),
            )
            .where("project_id", "=", permissions.project_id)
            .where("dictionaries.deleted_at", body.arkived ? "is not" : "is", null)
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("dictionaries")
            .where("dictionaries.id", "=", params.id)
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "dictionaries"),
            )
            .select(body.fields.map((f) => `dictionaries.${f}`) as SelectExpression<DB, "dictionaries">[])
            .$if(!!body.relations?.words, (qb) =>
              qb.select((eb) => {
                let word_query = eb
                  .selectFrom("words")
                  .select(["words.id", "words.title", "words.translation"])
                  .where("words.parent_id", "=", params.id);

                word_query = getNestedReadPermission(
                  word_query,
                  permissions.is_project_owner,
                  permissions.user_id,
                  "words.id",
                  "read_words",
                );

                return jsonArrayFrom(word_query).as("words");
              }),
            )
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "dictionaries");
            });

          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "dictionaries", params.id);
          }

          const data = await query.executeTakeFirst();
          if (body?.relations?.parents) {
            const parents = await GetParents({ db, id: params.id, table_name: "dictionaries" });
            return { data: { ...data, parents }, message: MessageEnum.success, ok: true, role_access: true };
          }
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadDictionarySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("dictionaries", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("dictionaries").where("id", "=", params.id).set(body.data).execute();
              if (body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, body.permissions);
              }
            });
            return { message: MessageEnum.success, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          body: UpdateDictionarySchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/arkive/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("dictionaries", params.id, permissions);

          if (permissionCheck) {
            await db
              .updateTable("dictionaries")
              .where("dictionaries.id", "=", params.id)
              .set({ deleted_at: new Date().toUTCString(), is_public: false })
              .execute();

            return { message: `Document ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
          const permissionCheck = await getHasEntityPermission("dictionaries", params.id, permissions);
          if (permissionCheck) {
            const data = await db
              .deleteFrom("dictionaries")
              .where("dictionaries.id", "=", params.id)
              .where("dictionaries.deleted_at", "is not", null)
              .returning(["id", "title", "project_id"])
              .executeTakeFirstOrThrow();

            return { data, message: `Dictionary ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { data: {}, message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
