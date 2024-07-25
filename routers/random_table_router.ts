import { Elysia } from "elysia";
import { SelectExpression, SelectQueryBuilder, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertRandomTableSchema, ReadRandomTableSchema, UpdateRandomTableSchema } from "../database/validation/random_tables";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  GetEntityChildren,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/utils";

export function random_table_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/random_tables", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            const random_table = await db.transaction().execute(async (tx) => {
              const { id } = await tx
                .insertInto("random_tables")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations) {
                if (body.relations?.random_table_options) {
                  const { random_table_options } = body.relations;
                  const withParentId = random_table_options.map((opt) => ({ ...opt.data, parent_id: id }));
                  await tx.insertInto("random_table_options").values(withParentId).execute();
                }
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, id, body.permissions);
              }
              return { id };
            });
            return {
              data: random_table,
              message: `Random table ${MessageEnum.successfully_created}`,
              ok: true,
              role_access: true,
            };
          },
          {
            body: InsertRandomTableSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("random_tables")
              .where("project_id", "=", body.data.project_id)
              .where("random_tables.deleted_at", body.arkived ? "is not" : "is", null)
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb
                  .clearSelect()
                  .select(body.fields.map((f) => `random_tables.${f}`) as SelectExpression<DB, "random_tables">[]),
              )
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("random_tables", qb, body.filters);
                return qb;
              })
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "random_tables");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "random_tables"),
              )
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

              .selectFrom("random_tables")
              .where("random_tables.id", "=", params.id)
              .$if(!!body?.relations?.children, (qb) =>
                GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "random_tables"),
              )
              .$if(!!body?.relations?.random_table_options, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("random_table_options")
                      .whereRef("random_table_options.parent_id", "=", "random_tables.id")
                      .select([
                        "random_table_options.id",
                        "random_table_options.title",
                        "random_table_options.description",
                        "random_table_options.icon",
                        "random_table_options.icon_color",
                        (ebb) =>
                          jsonArrayFrom(
                            ebb
                              .selectFrom("random_table_suboptions")
                              .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                              .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
                          ).as("random_table_suboptions"),
                      ])
                      .orderBy(
                        (ob) => sql`NULLIF(regexp_replace(${ob.ref("random_table_options.title")}, '\\D.*', ''), '')::int`,
                      )
                      .orderBy((ob) => sql`regexp_replace(${ob.ref("random_table_options.title")}, '^\\d+\\s+', '')`),
                  ).as("random_table_options"),
                ),
              )
              .select([
                "random_tables.id",
                "random_tables.title",
                "random_tables.icon",
                "random_tables.is_folder",
                "random_tables.is_public",
                "random_tables.parent_id",
                "random_tables.description",
              ])
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "random_tables");
              })
              .$if(!!body.permissions, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "random_tables", params.id),
              );

            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "random_tables", params.id);
            }
            const data = await query.executeTakeFirstOrThrow();

            if (body?.relations?.parents) {
              const parents = await GetParents({ db, id: params.id, table_name: "random_tables" });
              return { data: { ...data, parents }, message: "Success.", ok: true, role_access: true };
            }

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadRandomTableSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("random_tables", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                await tx.updateTable("random_tables").where("id", "=", params.id).set(body.data).executeTakeFirstOrThrow();

                if (body?.relations) {
                  if (body.relations?.random_table_options) {
                    const { random_table_options } = body.relations;
                    const existingRandomTableOptions = await tx
                      .selectFrom("random_table_options")
                      .select(["id"])
                      .where("random_table_options.parent_id", "=", params.id)
                      .execute();
                    const existingIds = existingRandomTableOptions.map((field) => field.id);
                    const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                      existingIds,
                      random_table_options.map((opt) => opt.data),
                    );
                    if (idsToRemove.length) {
                      await tx.deleteFrom("random_table_options").where("id", "in", idsToRemove).execute();
                    }
                    if (itemsToAdd.length) {
                      await tx
                        .insertInto("random_table_options")
                        .values(
                          itemsToAdd.map((item) => ({
                            parent_id: params.id,
                            title: item.title,
                            description: item.description,
                          })),
                        )
                        .execute();
                    }
                    if (itemsToUpdate.length) {
                      await Promise.all(
                        itemsToUpdate.map(async (item) => {
                          await tx
                            .updateTable("random_table_options")
                            .where("parent_id", "=", params.id)
                            .where("id", "=", item.id)
                            .set({ title: item.title, description: item.description })
                            .execute();
                        }),
                      );
                    }
                  }
                }
                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
              });
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }

            return { message: `Random table ${MessageEnum.successfully_updated}.`, ok: true, role_access: true };
          },
          {
            body: UpdateRandomTableSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("random_tables", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("random_tables")
                .where("random_tables.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Radnom tables ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
            const permissionCheck = await getHasEntityPermission("random_tables", params.id, permissions);
            if (permissionCheck) {
              await db.deleteFrom("random_tables").where("id", "=", params.id).execute();
              return { message: `Random table ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          { response: ResponseSchema },
        ),
    );
}
