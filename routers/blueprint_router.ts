import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { InsertBlueprintSchema, ListBlueprintSchema, ReadBlueprintSchema, UpdateBlueprintSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

export function blueprint_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/blueprints", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const newBlueprint = await tx
                .insertInto("blueprints")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations?.blueprint_fields?.length) {
                await tx
                  .insertInto("blueprint_fields")
                  .values(
                    body.relations.blueprint_fields.map((field) => ({
                      title: field.title,
                      parent_id: newBlueprint.id,
                      field_type: field.field_type,
                      sort: field.sort,
                      formula: field?.formula,
                      options: JSON.stringify(field.options || []),
                      random_table_id: field?.random_table_id || null,
                    })),
                  )
                  .execute();
              }

              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, newBlueprint.id, "blueprint_permissions", body.permissions);
              }
            });
            return { message: `Blueprint ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertBlueprintSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_blueprints"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("blueprints")
              .distinctOn(
                body.orderBy?.length
                  ? (["blueprints.id", ...body.orderBy.map((order) => order.field)] as any)
                  : "blueprints.id",
              )
              .where("blueprints.project_id", "=", body.data.project_id)
              .where("blueprints.deleted_at", body.arkived ? "is not" : "is", null)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields.map((f) => `blueprints.${f}`) as SelectExpression<DB, "blueprints">[]),
              )
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("blueprints", qb, body.filters);
                return qb;
              })

              .$if(!!body.orderBy?.length, (qb) => {
                qb = constructOrdering(body.orderBy, qb);
                return qb;
              })
              .$if(!!body?.relations, (qb) => {
                if (body?.relations?.blueprint_fields) {
                  qb = qb.select((eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("blueprint_fields")
                        .whereRef("blueprints.id", "=", "blueprint_fields.parent_id")
                        .select([
                          "blueprint_fields.id",
                          "blueprint_fields.title",
                          "blueprint_fields.field_type",
                          "blueprint_fields.options",
                          "blueprint_fields.formula",
                        ])
                        .orderBy("sort"),
                    ).as("blueprint_fields"),
                  );
                }

                return qb;
              })
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "blueprints");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "blueprints"),
              )
              .execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListBlueprintSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_blueprints"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            let query = db
              .selectFrom("blueprints")
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields.map((f) => `blueprints.${f}`) as SelectExpression<DB, "blueprints">[]),
              )
              .where("blueprints.id", "=", params.id)
              .$if(!!body?.relations?.blueprint_fields, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("blueprint_fields")
                      .whereRef("blueprint_fields.parent_id", "=", "blueprints.id")
                      .select([
                        "blueprint_fields.id",
                        "blueprint_fields.title",
                        "blueprint_fields.options",
                        "blueprint_fields.field_type",
                        "blueprint_fields.sort",
                        "blueprint_fields.formula",
                        "blueprint_fields.random_table_id",
                        "blueprint_fields.blueprint_id",
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("blueprints")
                              .whereRef("blueprints.id", "=", "blueprint_fields.blueprint_id")
                              .select(["id", "title", "icon"]),
                          ).as("blueprint"),
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("random_tables")
                              .whereRef("blueprint_fields.random_table_id", "=", "random_tables.id")
                              .select([
                                "id",
                                "title",
                                (ebb) =>
                                  jsonArrayFrom(
                                    ebb
                                      .selectFrom("random_table_options")
                                      .whereRef("random_tables.id", "=", "random_table_options.parent_id")
                                      .select([
                                        "id",
                                        "title",
                                        (ebbb) =>
                                          jsonArrayFrom(
                                            ebbb
                                              .selectFrom("random_table_suboptions")
                                              .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id")
                                              .select(["id", "title"]),
                                          ).as("random_table_suboptions"),
                                      ]),
                                  ).as("random_table_options"),
                              ]),
                          ).as("random_table"),
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("calendars")
                              .whereRef("blueprint_fields.calendar_id", "=", "calendars.id")
                              .select([
                                "id",
                                "title",
                                "days",
                                (ebb) =>
                                  jsonArrayFrom(
                                    ebb
                                      .selectFrom("months")
                                      .whereRef("calendars.id", "=", "months.parent_id")
                                      .select(["months.id", "months.title", "months.days"])
                                      .orderBy("months.sort"),
                                  ).as("months"),
                              ]),
                          ).as("calendar"),
                      ])
                      .orderBy("sort"),
                  ).as("blueprint_fields"),
                ),
              )
              .$if(!!body?.relations?.blueprint_instances, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("blueprint_instances")
                      .whereRef("blueprint_instances.parent_id", "=", "blueprints.id")
                      .select(["blueprint_instances.id", "blueprint_instances.parent_id"]),
                  ).as("blueprint_instances"),
                ),
              );

            if (permissions.is_project_owner) {
              query = query.leftJoin("blueprint_permissions", (join) =>
                join.on("blueprint_permissions.related_id", "=", params.id),
              );
            } else {
              query = checkEntityLevelPermission(query, permissions, "blueprints", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "blueprints", params.id);
            }

            const data = await query.executeTakeFirstOrThrow();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadBlueprintSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_blueprints"),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("blueprints", params.id, permissions);
            if (permissionCheck) {
              if (body.data) {
                await db.transaction().execute(async (tx) => {
                  if (body.data) {
                    await tx
                      .updateTable("blueprints")
                      .set(body.data)
                      .where("blueprints.id", "=", params.id)
                      .executeTakeFirstOrThrow();
                  }
                  if (body?.relations?.blueprint_fields) {
                    const { blueprint_fields } = body.relations;
                    const existingBlueprintFields = await tx
                      .selectFrom("blueprint_fields")
                      .select(["id", "parent_id"])
                      .where("blueprint_fields.parent_id", "=", params.id)
                      .execute();

                    const existingIds = existingBlueprintFields.map((field) => field.id);

                    const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, blueprint_fields);

                    if (idsToRemove.length) {
                      await tx.deleteFrom("blueprint_fields").where("id", "in", idsToRemove).execute();
                    }
                    if (itemsToAdd.length) {
                      await tx
                        .insertInto("blueprint_fields")
                        .values(
                          // @ts-ignore
                          itemsToAdd.map((field) => ({
                            ...omit(field, ["id"]),
                            options: JSON.stringify(field.options || []),
                            parent_id: params.id,
                          })),
                        )
                        .execute();
                    }
                    if (itemsToUpdate.length) {
                      await Promise.all(
                        itemsToUpdate.map(async (item) =>
                          tx
                            .updateTable("blueprint_fields")
                            .where("blueprint_fields.id", "=", item.id as string)
                            .set({ ...omit(item, ["id"]), options: item.options ? JSON.stringify(item.options) : null })
                            .execute(),
                        ),
                      );
                    }
                  }
                  if (body.permissions) {
                    await UpdateEntityPermissions(tx, params.id, "blueprint_permissions", body.permissions);
                  }
                });
              }

              return { message: `Blueprint ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateBlueprintSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_blueprints"),
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("blueprints", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("blueprints")
                .where("blueprints.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString() })
                .execute();

              return { message: `Blueprints ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_blueprints"),
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("blueprints", params.id, permissions);
            if (permissionCheck) {
              const data = await db
                .deleteFrom("blueprints")
                .where("blueprints.id", "=", params.id)
                .where("blueprints.deleted_at", "is not", null)
                .returning(["id", "title", "project_id"])
                .executeTakeFirstOrThrow();

              return {
                data: { ...data, is_folder: false },
                message: `Blueprint ${MessageEnum.successfully_deleted}.`,
                ok: true,
                role_access: true,
              };
            } else {
              noRoleAccessErrorHandler();
              return { data: {}, message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_blueprints"),
          },
        ),
    );
}
