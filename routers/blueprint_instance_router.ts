import { Elysia } from "elysia";
import { AliasedRawBuilder, AliasedSelectQueryBuilder, ExpressionBuilder, SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission, getNestedReadPermission } from "../database/queries";
import { readBlueprintInstance } from "../database/queries/blueprintInstanceQueries";
import {
  InsertBlueprintInstanceSchema,
  ListBlueprintInstanceSchema,
  ReadBlueprintInstanceSchema,
  UpdateBlueprintInstanceSchema,
} from "../database/validation/blueprint_instances";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import {
  blueprintInstanceRelationFilter,
  blueprintInstanceValueFilter,
  constructFilter,
  tagsRelationFilter,
} from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  checkDeletePermissions,
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/utils";

export function blueprint_instance_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
      all_permissions: {},
    } as PermissionDecorationType)
    .group("/blueprint_instances", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            const id = await db.transaction().execute(async (tx) => {
              const newInstance = await tx
                .insertInto("blueprint_instances")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();
              if (body.relations?.blueprint_fields?.length) {
                await Promise.all(
                  body.relations.blueprint_fields.map(async (field) => {
                    if (field?.characters?.length) {
                      const { characters } = field;
                      await tx
                        .insertInto("blueprint_instance_characters")
                        .values(
                          characters.map((char) => ({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: newInstance.id,
                            related_id: char.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.blueprint_instances?.length) {
                      const { blueprint_instances } = field;
                      await tx
                        .insertInto("blueprint_instance_blueprint_instances")
                        .values(
                          blueprint_instances.map((char) => ({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: newInstance.id,
                            related_id: char.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.documents?.length) {
                      const { documents } = field;
                      await tx
                        .insertInto("blueprint_instance_documents")
                        .values(
                          documents.map((doc) => ({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: newInstance.id,
                            related_id: doc.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.map_pins?.length) {
                      const { map_pins } = field;
                      await tx
                        .insertInto("blueprint_instance_map_pins")
                        .values(
                          map_pins.map((map_pin) => ({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: newInstance.id,
                            related_id: map_pin.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field.images?.length) {
                      const { images } = field;
                      await tx
                        .insertInto("blueprint_instance_images")
                        .values(
                          images.map((image) => ({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: newInstance.id,
                            related_id: image.related_id,
                          })),
                        )
                        .execute();
                      return;
                    }
                    if (field?.random_table) {
                      const { random_table } = field;
                      await tx
                        .insertInto("blueprint_instance_random_tables")
                        .values({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: random_table.related_id,
                          option_id: random_table?.option_id,
                        })
                        .execute();
                      return;
                    }
                    if (field?.calendar) {
                      await tx
                        .insertInto("blueprint_instance_calendars")
                        .values({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          related_id: field.calendar.related_id,
                          start_day: field.calendar?.start_day,
                          start_month_id: field.calendar?.start_month_id,
                          start_year: field.calendar?.start_year,
                          end_day: field.calendar?.end_day,
                          end_month_id: field.calendar?.end_month_id,
                          end_year: field.calendar?.end_year,
                        })
                        .execute();
                    }
                    if (field?.value || typeof field?.value === "boolean") {
                      await tx
                        .insertInto("blueprint_instance_value")
                        .values({
                          blueprint_field_id: field.id,
                          blueprint_instance_id: newInstance.id,
                          value: JSON.stringify(field.value),
                        })
                        .execute();
                    }
                  }),
                );
              }
              if (body.relations?.tags?.length) {
                await CreateTagRelations({
                  tx,
                  relationalTable: "_blueprint_instancesTotags",
                  id: newInstance.id,
                  tags: body.relations.tags,
                });
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, newInstance.id, body.permissions);
              }
              return newInstance.id;
            });
            const data = await db
              .selectFrom("blueprints")
              .select(["project_id"])
              .where("id", "=", body.data.parent_id)
              .executeTakeFirstOrThrow();

            return {
              data: { id, project_id: data.project_id, title: body.data.title },
              message: `Blueprint instance ${MessageEnum.successfully_created}`,
              ok: true,
              role_access: true,
            };
          },
          {
            body: InsertBlueprintInstanceSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("blueprint_instances")
              .select(
                body.fields.map((field) => `blueprint_instances.${field}`) as SelectExpression<DB, "blueprint_instances">[],
              )
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .distinctOn(
                body.orderBy
                  ? ([...body.orderBy.map((o) => o.field), "blueprint_instances.id"] as any)
                  : ["blueprint_instances.id"],
              )
              .where("blueprint_instances.deleted_at", body.arkived ? "is not" : "is", null);

            if (body.data?.parent_id) {
              query = query.where("blueprint_instances.parent_id", "=", body.data.parent_id);
            }
            if (permissions.project_id) {
              query = query
                .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                .where("blueprints.project_id", "=", permissions.project_id);
            }
            if (body.relations?.blueprint_fields) {
              query = query.select([
                (eb) => {
                  const bp_fields_select: (
                    | string
                    | ((ebb: ExpressionBuilder<DB, any>) => AliasedSelectQueryBuilder<any, any> | AliasedRawBuilder<any, any>)
                  )[] = [
                    "blueprint_fields.id",
                    (ebb: ExpressionBuilder<DB, any>) =>
                      ebb
                        .selectFrom("blueprint_instance_value")
                        .whereRef("blueprint_instance_value.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select(["value"])
                        .as("value"),
                  ];

                  if (permissions.all_permissions?.read_random_tables)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let random_table_query = ebb
                        .selectFrom("random_tables")
                        .whereRef("random_tables.id", "=", "blueprint_fields.random_table_id")
                        .select(["random_tables.id", "random_tables.title"]);

                      random_table_query = getNestedReadPermission(
                        random_table_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_fields.random_table_id",
                        "read_random_tables",
                      );

                      return jsonObjectFrom(random_table_query).as("random_table_data");
                    });

                  if (permissions.all_permissions?.read_characters)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let character_subquery = ebb
                        .selectFrom("blueprint_instance_characters")
                        .whereRef("blueprint_instance_characters.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_characters.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_characters.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("characters")
                                .whereRef("blueprint_instance_characters.related_id", "=", "characters.id")
                                .select(["characters.id", "characters.full_name", "characters.portrait_id"]),
                            ).as("character"),
                        ]);

                      character_subquery = getNestedReadPermission(
                        character_subquery,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_characters.related_id",
                        "read_characters",
                      );

                      return jsonArrayFrom(character_subquery).as("characters");
                    });
                  if (permissions.all_permissions?.read_blueprint_instances)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let bpi_query = ebb
                        .selectFrom("blueprint_instance_blueprint_instances")
                        .whereRef("blueprint_instance_blueprint_instances.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_blueprint_instances.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_blueprint_instances.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("blueprint_instances")
                                .whereRef("blueprint_instance_blueprint_instances.related_id", "=", "blueprint_instances.id")
                                .select([
                                  "blueprint_instances.id",
                                  "blueprint_instances.title",
                                  "blueprint_instances.parent_id",
                                ]),
                            ).as("blueprint_instance"),
                        ]);

                      bpi_query = getNestedReadPermission(
                        bpi_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_blueprint_instances.related_id",
                        "read_blueprint_instances",
                      );

                      return jsonArrayFrom(bpi_query).as("blueprint_instances");
                    });
                  if (permissions.all_permissions?.read_documents)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let document_query = ebb
                        .selectFrom("blueprint_instance_documents")
                        .whereRef("blueprint_instance_documents.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_documents.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_documents.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("documents")
                                .whereRef("blueprint_instance_documents.related_id", "=", "documents.id")
                                .select(["id", "title", "icon"]),
                            ).as("document"),
                        ]);

                      document_query = getNestedReadPermission(
                        document_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_documents.related_id",
                        "read_documents",
                      );

                      return jsonArrayFrom(document_query).as("documents");
                    });

                  // ! Temp until map pin permissions are introduced
                  if (permissions.all_permissions)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let map_pin_query = ebb
                        .selectFrom("blueprint_instance_map_pins")
                        .whereRef("blueprint_instance_map_pins.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_map_pins.blueprint_instance_id", "=", "blueprint_instances.id")

                        .select([
                          "blueprint_instance_map_pins.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("map_pins")
                                .whereRef("blueprint_instance_map_pins.related_id", "=", "map_pins.id")
                                .select(["id", "title", "icon", "parent_id"]),
                            ).as("map_pin"),
                        ]);

                      map_pin_query = getNestedReadPermission(
                        map_pin_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_map_pins.related_id",
                        "read_map_pins",
                      );

                      return jsonArrayFrom(map_pin_query).as("map_pins");
                    });
                  if (permissions.all_permissions?.read_events)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let event_query = ebb
                        .selectFrom("blueprint_instance_events")
                        .whereRef("blueprint_instance_events.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_events.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_events.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("events")
                                .whereRef("blueprint_instance_events.related_id", "=", "events.id")
                                .select(["id", "title", "parent_id"]),
                            ).as("event"),
                        ]);

                      event_query = getNestedReadPermission(
                        event_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_events.related_id",
                        "read_events",
                      );

                      return jsonArrayFrom(event_query).as("events");
                    });
                  if (permissions.all_permissions?.read_random_tables)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let random_table_query = ebb
                        .selectFrom("blueprint_instance_random_tables")
                        .whereRef("blueprint_instance_random_tables.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_random_tables.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select(["blueprint_instance_random_tables.related_id", "option_id"]);

                      random_table_query = getNestedReadPermission(
                        random_table_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_random_tables.related_id",
                        "read_random_tables",
                      );

                      return jsonObjectFrom(random_table_query).as("random_table");
                    });
                  if (permissions.all_permissions?.read_calendars)
                    bp_fields_select.push((ebb: ExpressionBuilder<DB, any>) => {
                      let calendar_query = ebb
                        .selectFrom("blueprint_instance_calendars")
                        .whereRef("blueprint_instance_calendars.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_calendars.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_calendars.related_id",
                          "start_day",
                          "start_month_id",
                          "start_year",
                          "end_day",
                          "end_month_id",
                          "end_year",
                        ]);

                      calendar_query = getNestedReadPermission(
                        calendar_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_calendars.related_id",
                        "read_calendars",
                      );

                      return jsonObjectFrom(calendar_query).as("calendar");
                    });
                  if (permissions.all_permissions?.read_assets)
                    bp_fields_select.push((ebb) => {
                      let image_query = ebb
                        .selectFrom("blueprint_instance_images")
                        .whereRef("blueprint_instance_images.blueprint_field_id", "=", "blueprint_fields.id")
                        .whereRef("blueprint_instance_images.blueprint_instance_id", "=", "blueprint_instances.id")
                        .select([
                          "blueprint_instance_images.related_id",
                          (ebbb) =>
                            jsonObjectFrom(
                              ebbb
                                .selectFrom("images")
                                .whereRef("blueprint_instance_images.related_id", "=", "images.id")
                                .select(["id", "title"]),
                            ).as("image"),
                        ]);

                      image_query = getNestedReadPermission(
                        image_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "blueprint_instance_images.related_id",
                        "read_assets",
                      );

                      return jsonArrayFrom(image_query).as("images");
                    });

                  return jsonArrayFrom(
                    eb
                      .selectFrom("blueprint_fields")
                      .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
                      .orderBy("sort")
                      // @ts-ignore
                      .select(bp_fields_select),
                  ).as("blueprint_fields");
                },
              ]);
            }
            if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
              query = constructFilter("blueprint_instances", query, body.filters);
            }
            if (body.relations?.blueprint) {
              query = query.select((eb) =>
                jsonObjectFrom(
                  eb.selectFrom("blueprints").whereRef("id", "=", "blueprint_instances.parent_id").select(["title", "icon"]),
                ).as("blueprint"),
              );
            }
            if (!!body?.relationFilters?.and?.length || !!body?.relationFilters?.or?.length) {
              const { characters, documents, map_pins, tags, events, value } = groupRelationFiltersByField(
                body.relationFilters || {},
              );

              if (tags?.filters?.length)
                query = tagsRelationFilter("blueprint_instances", "_blueprint_instancesTotags", query, tags?.filters || []);
              if (characters?.filters?.length)
                query = blueprintInstanceRelationFilter("blueprint_instance_characters", query, characters?.filters || []);
              if (documents?.filters?.length)
                query = blueprintInstanceRelationFilter("blueprint_instance_documents", query, documents?.filters || []);
              if (map_pins?.filters?.length)
                query = blueprintInstanceRelationFilter("blueprint_instance_map_pins", query, map_pins?.filters || []);
              if (events?.filters?.length)
                query = blueprintInstanceRelationFilter("blueprint_instance_events", query, map_pins?.filters || []);
              if (value?.filters?.length) query = blueprintInstanceValueFilter(query, value.filters);
            }
            if (body.orderBy?.length) {
              query = constructOrdering(body.orderBy, query);
            }
            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "blueprint_instances");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "blueprint_instances");
            }
            if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
              query = query.select((eb) =>
                TagQuery(
                  eb,
                  "_blueprint_instancesTotags",
                  "blueprint_instances",
                  permissions.is_project_owner,
                  permissions.user_id,
                ),
              );
            }

            const data = await query.execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListBlueprintInstanceSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post("/:id", async ({ params, body, permissions }) => readBlueprintInstance(body, params, permissions), {
          body: ReadBlueprintInstanceSchema,
          response: ResponseWithDataSchema,
        })
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("blueprint_instances", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                tx.updateTable("blueprint_instances")
                  .set(body.data)
                  .where("blueprint_instances.id", "=", params.id)
                  .executeTakeFirstOrThrow();

                if (body.relations?.blueprint_fields) {
                  await Promise.all(
                    body.relations.blueprint_fields.flatMap(async (field) => {
                      if (field.value || typeof field.value === "boolean") {
                        return tx
                          .insertInto("blueprint_instance_value")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            value: JSON.stringify(field.value),
                          })
                          .onConflict((oc) =>
                            oc
                              .columns(["blueprint_field_id", "blueprint_instance_id"])
                              .doUpdateSet({ value: JSON.stringify(field.value) }),
                          )
                          .execute();
                      }

                      if (field.characters) {
                        let query = tx.deleteFrom("blueprint_instance_characters");
                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_characters.related_id", "read_characters");
                        }

                        query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();
                        if (field.characters.length) {
                          return field.characters.map((char) =>
                            tx
                              .insertInto("blueprint_instance_characters")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      if (field.blueprint_instances) {
                        let query = tx.deleteFrom("blueprint_instance_blueprint_instances");

                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(
                            query,
                            "blueprint_instance_blueprint_instances.related_id",
                            "read_blueprint_instances",
                          );
                        }

                        await query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();

                        if (field.blueprint_instances.length) {
                          return field.blueprint_instances.map((char) =>
                            tx
                              .insertInto("blueprint_instance_blueprint_instances")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      if (field.documents) {
                        let query = tx.deleteFrom("blueprint_instance_documents");

                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_document.related_id", "read_documents");
                        }

                        await query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();

                        if (field.documents.length) {
                          return field.documents.map((char) =>
                            tx
                              .insertInto("blueprint_instance_documents")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      // ! PERMISSIONS
                      if (field.map_pins) {
                        let query = tx.deleteFrom("blueprint_instance_map_pins");
                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_map_pins.related_id", "read_map_pins");
                        }
                        await query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();
                        if (field.map_pins.length) {
                          return field.map_pins.map((char) =>
                            tx
                              .insertInto("blueprint_instance_map_pins")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      if (field.events) {
                        let query = tx.deleteFrom("blueprint_instance_events");

                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_events.related_id", "read_events");
                        }

                        await query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();
                        if (field.events.length) {
                          return field.events.map((char) =>
                            tx
                              .insertInto("blueprint_instance_events")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      if (field.images) {
                        let query = tx.deleteFrom("blueprint_instance_images");

                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_images.related_id", "read_assets");
                        }

                        await query
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id)
                          .execute();

                        if (field.images.length) {
                          return field.images.map((char) =>
                            tx
                              .insertInto("blueprint_instance_images")
                              .values({
                                blueprint_field_id: field.id,
                                blueprint_instance_id: params.id,
                                related_id: char.related_id,
                                sort: char.sort,
                              })
                              .execute(),
                          );
                        }
                      }
                      if (field.random_table) {
                        let query = tx
                          .deleteFrom("blueprint_instance_random_tables")
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id);
                        if (!permissions.is_project_owner) {
                          query = checkDeletePermissions(
                            query,
                            "blueprint_instance_random_tables.related_id",
                            "read_random_tables",
                          );
                          await query.execute();
                        }

                        return tx
                          .insertInto("blueprint_instance_random_tables")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: field.random_table.related_id,
                            option_id: field.random_table.option_id,
                          })
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                      if (field.calendar) {
                        let query = tx
                          .deleteFrom("blueprint_instance_calendars")
                          .where("blueprint_instance_id", "=", params.id)
                          .where("blueprint_field_id", "=", field.id);

                        if (!permissions?.is_project_owner) {
                          query = checkDeletePermissions(query, "blueprint_instance_calendars.related_id", "read_calendars");
                        }

                        await query.execute();

                        return tx
                          .insertInto("blueprint_instance_calendars")
                          .values({
                            blueprint_field_id: field.id,
                            blueprint_instance_id: params.id,
                            related_id: field.calendar.related_id,
                            start_day: field.calendar.start_day,
                            start_month_id: field.calendar.start_month_id,
                            start_year: field.calendar.start_year,
                            end_day: field.calendar.end_day,
                            end_month_id: field.calendar.end_month_id,
                            end_year: field.calendar.end_year,
                          })
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                      if (field.id && !field?.value) {
                        return tx
                          .deleteFrom("blueprint_instance_value")
                          .where("blueprint_field_id", "=", field.id)
                          .where("blueprint_instance_id", "=", params.id)
                          .execute();
                      }
                    }),
                  );
                }

                if (body.relations?.tags) {
                  await UpdateTagRelations({
                    relationalTable: "_blueprint_instancesTotags",
                    id: params.id,
                    newTags: body.relations.tags,
                    tx,
                    is_project_owner: permissions.is_project_owner,
                  });
                }
                if (body.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
              });

              return { message: `Blueprint instance ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateBlueprintInstanceSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("blueprint_instances", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("blueprint_instances")
                .where("blueprint_instances.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Blueprint instance ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
            const permissionCheck = await getHasEntityPermission("blueprint_instances", params.id, permissions);

            if (permissionCheck) {
              const res = await db
                .deleteFrom("blueprint_instances")
                .where("blueprint_instances.id", "=", params.id)
                .where("blueprint_instances.deleted_at", "is not", null)
                .returning(["blueprint_instances.parent_id", "blueprint_instances.title"])
                .executeTakeFirstOrThrow();

              const data = await db
                .selectFrom("blueprints")
                .where("id", "=", res.parent_id)
                .select(["project_id"])
                .executeTakeFirstOrThrow();

              return {
                data: { project_id: data.project_id, title: res.title },
                message: `Blueprint instance ${MessageEnum.successfully_deleted}.`,
                ok: true,
                role_access: true,
              };
            } else {
              noRoleAccessErrorHandler();
              return {
                data: {},
                message: "",
                ok: false,
                role_access: false,
              };
            }
          },
          {
            response: ResponseWithDataSchema,
          },
        ),
    );
}
