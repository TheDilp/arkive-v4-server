import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import {
  InsertCharacterFieldsTemplateSchema,
  ListCharacterFieldsTemplateSchema,
  ReadCharacterFieldsTemplateSchema,
  UpdateTemplateSchema,
} from "../database/validation/character_fields_templates";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntitiesWithOwnerId, getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/utils";

export function character_fields_templates_router(app: Elysia) {
  return app.group("/character_fields_templates", (server) =>
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
            const newTemplate = await tx
              .insertInto("character_fields_templates")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.character_fields_sections) {
              await tx
                .insertInto("character_fields_sections")
                .values(
                  getEntitiesWithOwnerId(
                    body.relations.character_fields_sections.map((section) => ({
                      ...section,
                      parent_id: newTemplate.id,
                    })),
                    permissions.user_id,
                  ),
                )
                .execute();
            }

            if (body.relations?.character_fields) {
              await tx
                .insertInto("character_fields")
                .values(
                  body.relations.character_fields.map((field) => ({
                    ...field,
                    parent_id: newTemplate.id,
                    options: JSON.stringify(field.options || []),
                  })),
                )
                .execute();
            }
            if (body.relations?.tags) {
              await CreateTagRelations({
                tx,
                relationalTable: "_character_fields_templatesTotags",
                id: newTemplate.id,
                tags: body.relations.tags,
              });
            }
            if (body.permissions?.length) {
              await CreateEntityPermissions(tx, newTemplate.id, body.permissions);
            }
          });
          return { message: `Template ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertCharacterFieldsTemplateSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          let query = db
            .selectFrom("character_fields_templates")
            .distinctOn(
              body.orderBy?.length
                ? (["character_fields_templates.id", ...body.orderBy.map((order) => order.field)] as any)
                : "character_fields_templates.id",
            )
            .where("character_fields_templates.project_id", "=", body.data.project_id)
            .where("character_fields_templates.deleted_at", body.arkived ? "is not" : "is", null)
            .select(
              (body.fields || [])?.map((field) => `character_fields_templates.${field}`) as SelectExpression<
                DB,
                "character_fields_templates"
              >[],
            );

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("character_fields_templates", query, body.filters);
          }
          if (!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length) {
            const { tags } = groupRelationFiltersByField(body.relationFilters || {});
            if (tags?.filters?.length)
              query = tagsRelationFilter(
                "character_fields_templates",
                "_character_fields_templatesTotags",
                query,
                tags?.filters || [],
                false,
              );
          }
          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }
          if (body?.relations) {
            if (body?.relations?.character_fields) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields")
                    .whereRef("character_fields_templates.id", "=", "character_fields.parent_id")
                    .select([
                      "character_fields.id",
                      "character_fields.title",
                      "character_fields.field_type",
                      "character_fields.options",
                      "character_fields.sort",
                      "character_fields.formula",
                      "character_fields.random_table_id",
                      "character_fields.blueprint_id",
                      "character_fields.section_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select([
                              "calendars.id",
                              "calendars.title",
                              "calendars.days",
                              (sb) =>
                                jsonArrayFrom(
                                  sb
                                    .selectFrom("months")
                                    .select(["months.id", "months.title", "months.days"])
                                    .orderBy("months.sort")
                                    .whereRef("months.parent_id", "=", "calendars.id"),
                                ).as("months"),
                            ])
                            .whereRef("calendars.id", "=", "character_fields.calendar_id"),
                        ).as("calendar"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select([
                              "random_tables.id",
                              "random_tables.title",
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
                            ])
                            .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                        ).as("random_table"),
                    ])
                    .orderBy(["character_fields.sort"]),
                ).as("character_fields"),
              );
            }
            if (body?.relations?.character_fields_sections) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields_sections")
                    .select([
                      "character_fields_sections.id",
                      "character_fields_sections.title",
                      "character_fields_sections.sort",
                    ]),
                ).as("character_fields_sections"),
              );
            }
            if (body?.relations?.tags) {
              query = query.select((eb) =>
                TagQuery(
                  eb,
                  "_character_fields_templatesTotags",
                  "character_fields_templates",
                  permissions.is_project_owner,
                  permissions.user_id,
                ),
              );
            }
          }
          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "character_fields_templates");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "character_fields_templates");
          }
          const data = await query.execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListCharacterFieldsTemplateSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("character_fields_templates")

            .select(
              body.fields.map((f) => `character_fields_templates.${f}`) as SelectExpression<DB, "character_fields_templates">[],
            )
            .where("character_fields_templates.id", "=", params.id);
          if (body?.relations?.character_fields) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("character_fields")
                  .whereRef("character_fields.parent_id", "=", "character_fields_templates.id")
                  .select([
                    "character_fields.id",
                    "character_fields.title",
                    "character_fields.options",
                    "character_fields.field_type",
                    "character_fields.sort",
                    "character_fields.formula",
                    "character_fields.random_table_id",
                    "character_fields.calendar_id",
                    "character_fields.blueprint_id",
                    "character_fields.section_id",
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("random_tables")
                          .select(["id", "title"])
                          .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
                      ).as("random_table"),
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("calendars")
                          .select(["id", "title", "icon"])
                          .whereRef("calendars.id", "=", "character_fields.calendar_id"),
                      ).as("calendar"),
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("blueprints")
                          .whereRef("blueprints.id", "=", "character_fields.blueprint_id")
                          .select(["id", "title", "icon"]),
                      ).as("blueprint"),
                  ])

                  .orderBy("sort"),
              ).as("character_fields"),
            );
          }

          if (body?.relations?.character_fields_sections) {
            query = query.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("character_fields_sections")
                  .select([
                    "character_fields_sections.id",
                    "character_fields_sections.title",
                    "character_fields_sections.sort",
                  ]),
              ).as("character_fields_sections"),
            );
          }

          if (body?.relations?.tags) {
            query = query.select((eb) =>
              TagQuery(
                eb,
                "_character_fields_templatesTotags",
                "character_fields_templates",
                permissions.is_project_owner,
                permissions.user_id,
              ),
            );
          }

          if (permissions.is_project_owner) {
            query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
          } else {
            query = checkEntityLevelPermission(query, permissions, "character_fields_templates", params.id);
          }
          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "character_fields_templates", params.id);
          }

          const data = await query.executeTakeFirst();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadCharacterFieldsTemplateSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("character_fields_templates", params.id, permissions);

          if (permissionCheck) {
            if (body.data) {
              await db.transaction().execute(async (tx) => {
                if (body.data) {
                  await tx
                    .updateTable("character_fields_templates")
                    .set(body.data)
                    .where("character_fields_templates.id", "=", params.id)
                    .executeTakeFirstOrThrow();
                }

                if (body.relations?.character_fields_sections) {
                  const { character_fields_sections } = body.relations;
                  const existingCharacterFieldsSections = await tx
                    .selectFrom("character_fields_sections")
                    .select(["id", "parent_id"])
                    .where("character_fields_sections.parent_id", "=", params.id)
                    .execute();

                  const existingIds = existingCharacterFieldsSections.map((field) => field.id);

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds,
                    character_fields_sections,
                  );

                  if (idsToRemove.length) {
                    await tx.deleteFrom("character_fields_sections").where("id", "in", idsToRemove).execute();
                  }
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("character_fields_sections")
                      .values(
                        // @ts-ignore
                        getEntitiesWithOwnerId(itemsToAdd, permissions.user_id).map((section) => ({
                          ...section,
                          parent_id: params.id,
                        })),
                      )
                      .execute();
                  }
                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("character_fields_sections")
                          .where("character_fields_sections.id", "=", item.id as string)
                          .set({ ...omit(item, ["id"]) })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body?.relations?.character_fields) {
                  const { character_fields } = body.relations;
                  const existingCharacterFields = await tx
                    .selectFrom("character_fields")
                    .select(["id", "parent_id"])
                    .where("character_fields.parent_id", "=", params.id)
                    .execute();

                  const existingIds = existingCharacterFields.map((field) => field.id);

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingIds, character_fields);

                  if (idsToRemove.length) {
                    await tx.deleteFrom("character_fields").where("id", "in", idsToRemove).execute();
                  }
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("character_fields")
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
                          .updateTable("character_fields")
                          .where("character_fields.id", "=", item.id as string)
                          .set({ ...omit(item, ["id"]), options: JSON.stringify(item.options || []) })
                          .execute(),
                      ),
                    );
                  }
                }
                if (body.relations?.tags) {
                  if (body.relations.tags.length)
                    UpdateTagRelations({
                      relationalTable: "_character_fields_templatesTotags",
                      id: params.id,
                      newTags: body.relations.tags,
                      tx,
                      is_project_owner: permissions.is_project_owner,
                    });
                  else await tx.deleteFrom("_character_fields_templatesTotags").where("A", "=", params.id).execute();
                }
                if (body.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
              });
            }

            return { message: `Template ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          body: UpdateTemplateSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/arkive/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("character_fields_templates", params.id, permissions);

          if (permissionCheck) {
            await db
              .updateTable("character_fields_templates")
              .where("character_fields_templates.id", "=", params.id)
              .set({ deleted_at: new Date().toUTCString() })
              .execute();

            return { message: `Character field template ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
          const permissionCheck = await getHasEntityPermission("character_fields_templates", params.id, permissions);
          if (permissionCheck) {
            const data = await db
              .deleteFrom("character_fields_templates")
              .where("character_fields_templates.id", "=", params.id)
              .where("character_fields_templates.deleted_at", "is not", null)
              .returning([
                "character_fields_templates.id",
                "character_fields_templates.title",
                "character_fields_templates.project_id",
              ])
              .executeTakeFirstOrThrow();
            return {
              data,
              message: `Character field template ${MessageEnum.successfully_deleted}`,
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
        },
      ),
  );
}
