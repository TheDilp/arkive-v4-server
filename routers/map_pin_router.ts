import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission, getNestedReadPermission } from "../database/queries";
import { InsertMapPinSchema, ListMapPinSchema, ReadMapPinSchema, UpdateMapPinSchema } from "../database/validation/map_pins";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  UpdateEntityPermissions,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../utils/transform";

export function map_pin_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/map_pins", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const map_pin = await tx
                .insertInto("map_pins")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations?.tags) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "_map_pinsTotags", id: map_pin.id, tags });
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, map_pin.id, body.permissions);
              }
            });
            const data = await db
              .selectFrom("maps")
              .select(["project_id"])
              .where("id", "=", body.data.parent_id)
              .executeTakeFirstOrThrow();
            return {
              data: { title: body.data.title, project_id: data.project_id },
              message: `Map pin ${MessageEnum.successfully_created}`,
              ok: true,
              role_access: true,
            };
          },
          {
            body: InsertMapPinSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_map_pins"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("map_pins")
              .select(body.fields.map((f) => `map_pins.${f}`) as SelectExpression<DB, "map_pins">[])
              .leftJoin("characters", "characters.id", "map_pins.character_id")
              .leftJoin("entity_permissions", (join) =>
                join.on((jb) =>
                  jb.or([
                    jb("map_pins.id", "=", jb.ref("entity_permissions.related_id")),
                    jb("map_pins.character_id", "=", jb.ref("entity_permissions.related_id")),
                  ]),
                ),
              )
              .where((wb) => {
                return wb.or([
                  wb("map_pins.owner_id", "=", permissions.user_id),
                  wb("characters.owner_id", "=", permissions.user_id),
                  wb.and([
                    wb("map_pins.character_id", "is", null),
                    wb.and([
                      wb("entity_permissions.user_id", "=", permissions.user_id),
                      wb("entity_permissions.permission_id", "=", permissions.permission_id),
                      wb("entity_permissions.related_id", "=", wb.ref("map_pins.id")),
                    ]),
                  ]),
                  wb.and([
                    wb.and([
                      wb("entity_permissions.user_id", "=", permissions.user_id),
                      wb("entity_permissions.permission_id", "=", permissions.permission_id),
                      wb("entity_permissions.related_id", "=", wb.ref("characters.id") || ""),
                    ]),
                  ]),

                  wb("entity_permissions.role_id", "=", permissions.role_id),
                ]);
              });
            if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
              query = constructFilter("map_pins", query, body.filters);
            }

            if (body?.relations?.character) {
              query = query.select([
                (eb) =>
                  jsonObjectFrom(
                    eb
                      .selectFrom("characters")
                      .select(["characters.id", "characters.full_name", "characters.portrait_id"])
                      .whereRef("map_pins.character_id", "=", "characters.id"),
                  ).as("character"),
              ]);
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "map_pins");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              // @ts-ignore
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "map_pins");
            }

            const data = await query.execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListMapPinSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_map_pins"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            let query = db
              .selectFrom("map_pins")
              .select(body.fields.map((f) => `map_pins.${f}`) as SelectExpression<DB, "map_pins">[])
              .select([
                (eb) => {
                  let character_query = eb
                    .selectFrom("characters")
                    .whereRef("characters.id", "=", "map_pins.character_id")
                    .select(["characters.id", "characters.full_name", "characters.portrait_id"]);
                  character_query = getNestedReadPermission(
                    character_query,
                    permissions.is_project_owner,
                    permissions.user_id,
                    "characters.id",
                    "read_characters",
                  );

                  return jsonObjectFrom(character_query).as("character");
                },
                (eb) => {
                  let document_query = eb
                    .selectFrom("documents")
                    .whereRef("documents.id", "=", "map_pins.doc_id")
                    .select(["documents.id", "documents.title"]);

                  document_query = getNestedReadPermission(
                    document_query,
                    permissions.is_project_owner,
                    permissions.user_id,
                    "documents.id",
                    "read_documents",
                  );

                  return jsonObjectFrom(document_query).as("document");
                },
                (eb) => {
                  let map_query = eb
                    .selectFrom("maps")
                    .whereRef("maps.id", "=", "map_pins.map_link")
                    .select(["maps.id", "maps.title", "maps.image_id"]);

                  map_query = getNestedReadPermission(
                    map_query,
                    permissions.is_project_owner,
                    permissions.user_id,
                    "maps.id",
                    "read_maps",
                  );

                  return jsonObjectFrom(map_query).as("linked_map");
                },
              ])
              .where("map_pins.id", "=", params.id);

            if (body.relations?.events) {
              query = query.leftJoin("event_map_pins", "event_map_pins.related_id", "map_pins.id").select((eb) => {
                let event_query = eb
                  .selectFrom("events")
                  .whereRef("event_map_pins.event_id", "=", "events.id")
                  .select(["events.id", "events.title", "events.image_id", "events.parent_id"]);

                // @ts-ignore
                event_query = getNestedReadPermission(
                  event_query,
                  permissions.is_project_owner,
                  permissions.user_id,
                  "events.id",
                  "read_events",
                );

                return jsonArrayFrom(event_query).as("events");
              });
            }

            if (permissions.is_project_owner) {
              query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
            } else {
              query = checkEntityLevelPermission(query, permissions, "map_pins", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "map_pins", params.id);
            }

            const data = await query.executeTakeFirst();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadMapPinSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_map_pins"),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("map_pins", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                tx.updateTable("map_pins").set(body.data).where("map_pins.id", "=", params.id).execute();

                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
              });
              return { message: `Map pin ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateMapPinSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_map_pins"),
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("documents", params.id, permissions);
            if (permissionCheck) {
              const res = await db
                .deleteFrom("map_pins")
                .where("map_pins.id", "=", params.id)
                .returning(["map_pins.parent_id", "map_pins.title"])
                .executeTakeFirstOrThrow();

              const data = await db
                .selectFrom("maps")
                .where("id", "=", res.parent_id)
                .select(["project_id"])
                .executeTakeFirstOrThrow();
              return {
                data: { project_id: data.project_id, title: res.title },
                message: `Map pin ${MessageEnum.successfully_deleted}`,
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
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_documents"),
          },
        ),
    );
}
