import { Elysia } from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import {
  InsertCalendarSchema,
  ListCalendarSchema,
  ReadCalendarSchema,
  UpdateCalendarSchema,
} from "../database/validation/calendars";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetEntityChildren,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/utils";

export function calendar_router(app: Elysia) {
  return app.group("/calendars", (server) =>
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
          const id = await db.transaction().execute(async (tx) => {
            const { id } = await tx
              .insertInto("calendars")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body?.relations?.months?.length)
              await tx
                .insertInto("months")
                .values(body.relations.months.map((month) => ({ ...month.data, parent_id: id })))
                .execute();
            if (body?.relations?.eras?.length)
              await tx
                .insertInto("eras")
                .values(body.relations.eras.map((era) => ({ ...era.data, parent_id: id })))
                .execute();

            if (body.relations?.tags?.length) {
              const { tags } = body.relations;
              await CreateTagRelations({ tx, relationalTable: "_calendarsTotags", id, tags });
            }
            if (body.permissions?.length) {
              await CreateEntityPermissions(tx, id, body.permissions);
            }
            return id;
          });

          return { data: { id }, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: InsertCalendarSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          let query = db
            .selectFrom("calendars")
            .where("calendars.project_id", "=", permissions?.project_id)
            .where("calendars.deleted_at", body.arkived ? "is not" : "is", null)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .select(body.fields.map((f) => `calendars.${f}`) as SelectExpression<DB, "calendars">[]);
          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("calendars", query, body.filters);
          }
          if (body?.relations?.tags && permissions?.all_permissions?.read_tags) {
            query = query.select((eb) =>
              TagQuery(eb, "_calendarsTotags", "calendars", permissions.is_project_owner, permissions.user_id),
            );
          }
          if (!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length) {
            const { tags } = groupRelationFiltersByField(body.relationFilters || {});

            if (tags?.filters?.length)
              query = tagsRelationFilter("calendars", "_calendarsTotags", query, tags?.filters || [], false);
          }

          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "calendars");
          }

          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "calendars");
          }

          const data = await query.execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListCalendarSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("calendars")
            .where("calendars.id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields.map((f) => `calendars.${f}`) as SelectExpression<DB, "calendars">[]),
            )
            .$if(!!body?.relations, (qb) => {
              if (body.relations?.months) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("months")
                      .select(["months.id", "months.days", "months.sort", "months.title", "months.parent_id"])
                      .where("months.parent_id", "=", params.id)
                      .orderBy("months.sort"),
                  ).as("months"),
                );
              }
              if (body.relations?.leap_days) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("leap_days")
                      .select(["leap_days.id", "leap_days.month_id", "leap_days.parent_id", "leap_days.conditions"])
                      .where("leap_days.parent_id", "=", params.id),
                  ).as("leap_days"),
                );
              }
              if (body.relations?.eras) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("eras")
                      .select([
                        "eras.id",
                        "eras.title",
                        "eras.start_day",
                        "eras.start_month",
                        "eras.start_year",
                        "eras.start_month_id",
                        "eras.end_day",
                        "eras.end_month",
                        "eras.end_year",
                        "eras.end_month_id",
                        "eras.parent_id",
                        "eras.color",
                      ])
                      .orderBy("eras.start_year")
                      .where("eras.parent_id", "=", params.id),
                  ).as("eras"),
                );
              }
              if (body?.relations?.tags && permissions?.all_permissions?.read_tags) {
                qb = qb.select((eb) =>
                  TagQuery(eb, "_calendarsTotags", "calendars", permissions.is_project_owner, permissions.user_id),
                );
              }
              return qb;
            })
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "calendars"),
            )
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "calendars");
            });

          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "calendars", params.id);
          }

          const data = await query.executeTakeFirstOrThrow();

          if (body?.relations?.parents) {
            const parents = await GetParents({ db, id: params.id, table_name: "calendars" });
            // @ts-ignore
            data.parents = parents;
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          }

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadCalendarSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("calendars", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("calendars").where("calendars.id", "=", params.id).set(body.data).execute();
              if (body?.relations?.leap_days) {
                const existingLeapDays = await tx
                  .selectFrom("leap_days")
                  .where("leap_days.parent_id", "=", params.id)
                  .select(["id"])
                  .execute();
                const existingLeapDayIds = existingLeapDays.map((month) => month.id);

                const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                  existingLeapDayIds,
                  body.relations.leap_days.map((ld) => ld.data),
                );
                if (idsToRemove.length) {
                  await tx.deleteFrom("leap_days").where("leap_days.id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("leap_days")
                    .values(
                      itemsToAdd.map((m) => ({
                        ...(m as any),
                        conditions: JSON.stringify(m.conditions),
                        parent_id: params.id,
                      })),
                    )
                    .execute();
                }
                if (itemsToUpdate.length) {
                  await Promise.all(
                    itemsToUpdate.map(async (item) => {
                      await tx
                        .updateTable("leap_days")
                        .where("parent_id", "=", params.id)
                        .where("id", "=", item.id)
                        .set(item)
                        .execute();
                    }),
                  );
                }
              }

              if (body?.relations?.months) {
                const existingMonths = await tx
                  .selectFrom("months")
                  .where("months.parent_id", "=", params.id)
                  .select(["id"])
                  .execute();

                const existingMonthIds = existingMonths.map((month) => month.id);

                const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                  existingMonthIds,
                  body.relations.months.map((m) => m.data),
                );
                if (idsToRemove.length) {
                  await tx.deleteFrom("months").where("months.id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("months")
                    .values(itemsToAdd.map((m) => ({ ...(m as any), parent_id: params.id })))
                    .execute();
                }
                if (itemsToUpdate.length) {
                  await Promise.all(
                    itemsToUpdate.map(async (item) => {
                      await tx
                        .updateTable("months")
                        .where("parent_id", "=", params.id)
                        .where("months.id", "=", item.id)
                        .set(item)
                        .execute();
                    }),
                  );
                }
              }

              if (body?.relations?.eras) {
                const existingEras = await tx
                  .selectFrom("eras")
                  .where("eras.parent_id", "=", params.id)
                  .select(["id"])
                  .execute();

                const existingEraIds = existingEras.map((era) => era.id);

                const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                  existingEraIds,
                  body.relations.eras.map((m) => m.data),
                );
                if (idsToRemove.length) {
                  await tx.deleteFrom("eras").where("eras.id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("eras")
                    .values(itemsToAdd.map((m) => ({ ...(m as any), parent_id: params.id })))
                    .execute();
                }
                if (itemsToUpdate.length) {
                  await Promise.all(
                    itemsToUpdate.map(async (item) => {
                      await tx
                        .updateTable("eras")
                        .where("parent_id", "=", params.id)
                        .where("eras.id", "=", item.id)
                        .set(item)
                        .execute();
                    }),
                  );
                }
              }

              if (body?.relations?.tags) {
                await UpdateTagRelations({
                  relationalTable: "_calendarsTotags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                  is_project_owner: permissions.is_project_owner,
                });
              }
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
          body: UpdateCalendarSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/arkive/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("calendars", params.id, permissions);

          if (permissionCheck) {
            await db
              .updateTable("calendars")
              .where("calendars.id", "=", params.id)
              .set({ deleted_at: new Date().toUTCString(), is_public: false })
              .execute();

            return { message: `Calendar ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
          const permissionCheck = await getHasEntityPermission("calendars", params.id, permissions);
          if (permissionCheck) {
            const data = await db
              .deleteFrom("calendars")
              .where("calendars.id", "=", params.id)
              .where("calendars.deleted_at", "is not", null)
              .returning(["id", "title", "project_id"])
              .executeTakeFirstOrThrow();

            return { data, message: `Calendar ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
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
