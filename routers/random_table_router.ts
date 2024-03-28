import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { getHasEntityPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertRandomTableSchema, ReadRandomTableSchema, UpdateRandomTableSchema } from "../database/validation/random_tables";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  GetEntityChildren,
  GetParents,
  GetRelationsForUpdating,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

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
            await db.transaction().execute(async (tx) => {
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
                await CreateEntityPermissions(tx, id, "random_table_permissions", body.permissions);
              }
            });
            return { message: `Random table ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertRandomTableSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_random_tables"),
          },
        )
        .post(
          "/",
          async ({ body }) => {
            const data = await db
              .selectFrom("random_tables")
              .where("project_id", "=", body.data.project_id)
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields as SelectExpression<DB, "random_tables">[]),
              )
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("random_tables", qb, body.filters);
                return qb;
              })
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))
              .execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: EntityListSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_random_tables"),
          },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            const data = await db

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
                      ]),
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
              .executeTakeFirstOrThrow();

            if (body?.relations?.parents) {
              const parents = await GetParents({ db, id: params.id, table_name: "random_tables" });
              return { data: { ...data, parents }, message: "Success.", ok: true, role_access: true };
            }

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadRandomTableSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_random_tables"),
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
                    const existingCharacterFields = await tx
                      .selectFrom("random_table_options")
                      .select(["id"])
                      .where("random_table_options.parent_id", "=", params.id)
                      .execute();
                    const existingIds = existingCharacterFields.map((field) => field.id);
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
                  await UpdateEntityPermissions(tx, params.id, "random_table_permissions", body.permissions);
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
            beforeHandle: async (context) => beforeRoleHandler(context, "update_random_tables"),
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
          { response: ResponseSchema, beforeHandle: async (context) => beforeRoleHandler(context, "delete_random_tables") },
        ),
    );
}
