import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission, getNestedReadPermission } from "../database/queries";
import { EntityListSchema } from "../database/validation";
import { InsertMapSchema, ReadMapSchema, UpdateMapSchema } from "../database/validation/maps";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/utils";

export function map_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/maps", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            const id = await db.transaction().execute(async (tx) => {
              const map = await tx
                .insertInto("maps")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations?.tags?.length)
                await CreateTagRelations({ tx, relationalTable: "_mapsTotags", id: map.id, tags: body.relations.tags });

              if (body?.relations?.map_layers?.length) {
                const formattedLayers = body.relations.map_layers.map((layer) => ({ ...layer.data, parent_id: map.id }));
                await tx.insertInto("map_layers").values(formattedLayers).execute();
              }
              if (body?.permissions) {
                await CreateEntityPermissions(tx, map.id, body.permissions);
              }
              return map.id;
            });

            return { data: { id }, message: `Map ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertMapSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("maps")
              .select(body.fields.map((f) => `maps.${f}`) as SelectExpression<DB, "maps">[])
              .distinctOn(body.orderBy?.length ? (["maps.id", ...body.orderBy.map((order) => order.field)] as any) : "maps.id")
              .where("project_id", "=", permissions.project_id)
              .where("maps.deleted_at", body.arkived ? "is not" : "is", null)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

            if (body.orderBy) {
              query = constructOrdering(body.orderBy, query);
            }
            if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
              query = query.select((eb) =>
                TagQuery(eb, "_mapsTotags", "maps", permissions.is_project_owner, permissions.user_id),
              );
            }
            if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
              query = constructFilter("maps", query, body.filters);
            }
            if (!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length) {
              const { tags } = groupRelationFiltersByField(body.relationFilters || {});

              if (tags?.filters?.length) query = tagsRelationFilter("maps", "_mapsTotags", query, tags?.filters || [], false);
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "maps");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "maps");
            }

            const data = await query.execute();

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
              .selectFrom("maps")
              .select(body.fields.map((f) => `maps.${f}`) as SelectExpression<DB, "maps">[])
              .where("maps.id", "=", params.id);
            if (body?.relations?.map_pins) {
              query = query.select((eb) => {
                let map_pins_query = eb
                  .selectFrom("map_pins")
                  .distinctOn("map_pins.id")
                  .leftJoin(
                    "entity_permissions as character_permissions",
                    "character_permissions.related_id",
                    "map_pins.character_id",
                  )
                  .leftJoin("permissions as char_perm_codes", "char_perm_codes.id", "character_permissions.permission_id")
                  .leftJoin("entity_permissions as map_pin_permissions", "map_pin_permissions.related_id", "map_pins.id")
                  .leftJoin("permissions as map_pin_perm_codes", "map_pin_perm_codes.id", "map_pin_permissions.permission_id")
                  .leftJoin("characters", "characters.id", "map_pins.character_id")
                  .select([
                    "map_pins.id",
                    "map_pins.background_color",
                    "map_pins.border_color",
                    "map_pins.color",
                    "map_pins.character_id",
                    "map_pins.doc_id",
                    "map_pins.image_id",
                    "map_pins.icon",
                    "map_pins.title",
                    "map_pins.parent_id",
                    "map_pins.is_public",
                    "map_pins.lat",
                    "map_pins.lng",
                    "map_pins.map_link",
                    "map_pins.show_background",
                    "map_pins.show_border",
                    "map_pins.map_pin_type_id",
                    (eb) => {
                      let character_query = eb
                        .selectFrom("characters")
                        .whereRef("characters.id", "=", "map_pins.character_id")
                        .select(["characters.id", "characters.full_name", "characters.portrait_id"]);

                      // @ts-ignore
                      character_query = getNestedReadPermission(
                        character_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "characters.id",
                        "read_characters",
                      );

                      return jsonObjectFrom(character_query).as("character");
                    },
                  ])
                  .whereRef("map_pins.parent_id", "=", "maps.id")
                  .where((wb) =>
                    wb.or([
                      wb("map_pins.character_id", "is", null),
                      wb("characters.owner_id", "=", permissions.user_id),
                      wb.and([
                        wb("character_permissions.user_id", "=", permissions.user_id),
                        wb("char_perm_codes.code", "=", "read_characters"),
                        wb("character_permissions.related_id", "=", wb.ref("characters.id")),
                      ]),
                      wb("character_permissions.role_id", "=", permissions.role_id),
                    ]),
                  )
                  .where((wb) => {
                    return wb.or([
                      wb("map_pins.owner_id", "=", permissions.user_id),
                      wb.and([
                        wb("map_pin_permissions.user_id", "=", permissions.user_id),
                        wb("map_pin_perm_codes.code", "=", "read_map_pins"),
                        wb("map_pin_permissions.related_id", "=", wb.ref("map_pins.id")),
                      ]),
                      wb("map_pin_permissions.role_id", "=", permissions.role_id),
                    ]);
                  });

                return jsonArrayFrom(map_pins_query).as("map_pins");
              });
            }
            if (body?.relations?.map_layers) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("map_layers")
                    .leftJoin("entity_permissions", "entity_permissions.related_id", "map_layers.image_id")
                    .leftJoin("images", "images.id", "map_layers.image_id")
                    .select([
                      "map_layers.id",
                      "map_layers.title",
                      "map_layers.image_id",
                      "map_layers.is_public",
                      "map_layers.parent_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("images")
                            .whereRef("images.id", "=", "map_layers.image_id")
                            .select(["images.id", "images.title"]),
                        ).as("image"),
                    ])
                    .whereRef("map_layers.parent_id", "=", "maps.id")
                    .where((wb) =>
                      wb.or([
                        wb("images.owner_id", "=", permissions.user_id),
                        wb.and([
                          wb("entity_permissions.user_id", "=", permissions.user_id),
                          wb("entity_permissions.permission_id", "=", permissions.permission_id),
                          wb("entity_permissions.related_id", "=", wb.ref("images.id")),
                        ]),
                        wb("entity_permissions.role_id", "=", permissions.role_id),
                      ]),
                    ),
                ).as("map_layers"),
              );
            }
            if (body?.relations?.images) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb.selectFrom("images").select(["images.id", "images.title"]).whereRef("maps.image_id", "=", "images.id"),
                ).as("images"),
              );
            }
            if (body?.relations?.tags) {
              query = query.select((eb) =>
                TagQuery(eb, "_mapsTotags", "maps", permissions.is_project_owner, permissions.user_id),
              );
            }
            if (permissions.is_project_owner) {
              query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
            } else {
              query = checkEntityLevelPermission(query, permissions, "maps", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "maps", params.id);
            }

            const data = await query.executeTakeFirstOrThrow();
            if (body?.relations?.parents) {
              const parents = await GetParents({ db, id: params.id, table_name: "maps" });
              data.parents = parents;
              return { data, message: MessageEnum.success, ok: true, role_access: true };
            }

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadMapSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("maps", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                if (body?.relations) {
                  if (body.relations?.tags)
                    UpdateTagRelations({
                      relationalTable: "_mapsTotags",
                      id: params.id,
                      newTags: body.relations.tags,
                      tx,
                      is_project_owner: permissions.is_project_owner,
                    });

                  if (body.relations?.map_layers) {
                    const existingMapLayers = await tx
                      .selectFrom("map_layers")
                      .select(["id", "title", "parent_id"])
                      .where("map_layers.parent_id", "=", params.id)
                      .execute();
                    const existingIds = existingMapLayers.map((layer) => layer.id);
                    const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                      existingIds,
                      body.relations?.map_layers.map((layer) => layer.data),
                    );

                    if (idsToRemove.length) {
                      await tx.deleteFrom("map_layers").where("map_layers.id", "in", idsToRemove).execute();
                    }
                    if (itemsToAdd.length) {
                      await tx
                        .insertInto("map_layers")
                        .values(
                          itemsToAdd.map((item) => ({
                            title: item.title,
                            parent_id: item.parent_id,
                            image_id: item.image_id,
                            is_public: item.is_public,
                          })),
                        )
                        .execute();
                    }
                    if (itemsToUpdate.length) {
                      await Promise.all(
                        itemsToUpdate.map(async (item) => {
                          await tx.updateTable("map_layers").where("map_layers.id", "=", item.id).set(item).execute();
                        }),
                      );
                    }
                  }
                }
                if (body.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
                if (body.data) await tx.updateTable("maps").where("maps.id", "=", params.id).set(body.data).execute();
              });

              return { message: `Map ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateMapSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("maps", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("maps")
                .where("maps.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Map ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
            const permissionCheck = await getHasEntityPermission("maps", params.id, permissions);

            if (permissionCheck) {
              const data = await db
                .deleteFrom("maps")
                .where("maps.id", "=", params.id)
                .where("maps.deleted_at", "is not", null)
                .returning(["id", "title", "project_id"])
                .executeTakeFirstOrThrow();

              return { data, message: `Map ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
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
