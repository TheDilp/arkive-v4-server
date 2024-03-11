import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntityListSchema } from "../database/validation";
import { InsertMapSchema, ReadMapSchema, UpdateMapSchema } from "../database/validation/maps";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetParents,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

export function map_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_owner: false,
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
            await db.transaction().execute(async (tx) => {
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
                await CreateEntityPermissions(tx, map.id, "map_permissions", body.permissions);
              }
            });

            return { message: `Map ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertMapSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_maps"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("maps")
              .where("project_id", "=", body.data.project_id)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "maps">[]))
              .$if(!!body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_mapsTotags", "maps")))
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("maps", qb, body.filters);
                return qb;
              })
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "maps");
              })
              .execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: EntityListSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_maps"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            const data = await db
              .selectFrom("maps")
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "maps">[]))
              .where("maps.id", "=", params.id)
              .$if(!!body?.relations?.map_pins, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("map_pins")
                      .select([
                        "map_pins.id",
                        "map_pins.background_color",
                        "map_pins.border_color",
                        "map_pins.color",
                        "map_pins.character_id",
                        "map_pins.doc_id",
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
                        (eb) =>
                          jsonObjectFrom(
                            eb
                              .selectFrom("characters")
                              .whereRef("characters.id", "=", "map_pins.character_id")
                              .select(["id", "full_name", "portrait_id"]),
                          ).as("character"),
                      ])
                      .whereRef("map_pins.parent_id", "=", "maps.id"),
                  ).as("map_pins"),
                ),
              )
              .$if(!!body?.relations?.map_layers, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("map_layers")
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
                      .whereRef("map_layers.parent_id", "=", "maps.id"),
                  ).as("map_layers"),
                ),
              )
              .$if(!!body?.relations?.images, (qb) =>
                qb.select((eb) =>
                  jsonArrayFrom(eb.selectFrom("images").select(["id", "title"]).whereRef("maps.image_id", "=", "images.id")).as(
                    "images",
                  ),
                ),
              )

              .$if(!!body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_mapsTotags", "maps")))
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "maps", params.id);
              })
              .executeTakeFirstOrThrow();

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
            beforeHandle: async (context) => beforeRoleHandler(context, "read_maps"),
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
                    UpdateTagRelations({ relationalTable: "_mapsTotags", id: params.id, newTags: body.relations.tags, tx });

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
                  await UpdateEntityPermissions(tx, params.id, "map_permissions", body.permissions);
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
            beforeHandle: async (context) => beforeRoleHandler(context, "update_maps"),
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
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_maps"),
          },
        ),
    );
}
