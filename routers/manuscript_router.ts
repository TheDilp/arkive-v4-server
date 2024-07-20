import { Elysia } from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import {
  InsertManuscriptSchema,
  ListManuscriptSchema,
  ReadManuscriptSchema,
  UpdateManuscriptSchema,
} from "../database/validation/manuscripts";
import { MessageEnum } from "../enums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
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
import { getEntityWithOwnerId } from "../utils/utils";

export function manuscript_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/manuscripts", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const manuscript = await tx
                .insertInto("manuscripts")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body.relations?.entities?.length) {
                await tx
                  .insertInto("manuscript_entities")
                  .values(
                    body.relations?.entities.map((doc) => ({
                      ...doc,
                      manuscript_id: manuscript.id,
                    })),
                  )
                  .execute();
              }

              if (body.relations?.tags?.length) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "manuscript_tags", id: manuscript.id, tags });
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, manuscript.id, body.permissions);
              }
            });

            return { ok: true, role_access: true, message: `Manuscript ${MessageEnum.successfully_created}` };
          },
          {
            beforeHandle: async (context) => beforeRoleHandler(context, "create_manuscripts"),
            body: InsertManuscriptSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("manuscripts")
              .select(body.fields.map((f) => `manuscripts.${f}`) as SelectExpression<DB, "manuscripts">[])
              .distinctOn(
                body.orderBy?.length
                  ? (["manuscripts.id", ...body.orderBy.map((order) => order.field)] as any)
                  : "manuscripts.id",
              )
              .where("manuscripts.project_id", "=", body?.data?.project_id)
              .where("manuscripts.deleted_at", body.arkived ? "is not" : "is", null)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

            if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
              query = query.select((eb) =>
                TagQuery(eb, "manuscript_tags", "manuscripts", permissions.is_project_owner, permissions.user_id),
              );
            }
            if (body.orderBy) {
              query = constructOrdering(body.orderBy, query);
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, "manuscripts");
            }
            if (!!body.permissions && !permissions.is_project_owner) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "manuscripts");
            }

            const data = await query.execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListManuscriptSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_manuscripts"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            let query = db
              .selectFrom("manuscripts")
              .where("manuscripts.id", "=", params.id)
              .select(body.fields.map((f) => `manuscripts.${f}`) as SelectExpression<DB, "manuscripts">[]);
            if (body?.relations) {
              if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
                query = query.select((eb) =>
                  TagQuery(eb, "manuscript_tags", "manuscripts", permissions.is_project_owner, permissions.user_id),
                );
              }
              if (body?.relations?.entities) {
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_entities")
                      .leftJoin("characters", "characters.id", "manuscript_entities.character_id")
                      .leftJoin("blueprint_instances", "blueprint_instances.id", "manuscript_entities.blueprint_instance_id")
                      .leftJoin("documents", "documents.id", "manuscript_entities.document_id")
                      .leftJoin("maps", "maps.id", "manuscript_entities.map_id")
                      .leftJoin("map_pins", (jb) =>
                        jb.onRef("map_pins.id", "=", "manuscript_entities.map_pin_id").on("map_pins.character_id", "is", null),
                      )
                      .leftJoin("graphs", "graphs.id", "manuscript_entities.graph_id")
                      .leftJoin("events", "events.id", "manuscript_entities.event_id")
                      .leftJoin("images", "images.id", "manuscript_entities.image_id")
                      .select([
                        "manuscript_entities.id",
                        "manuscript_entities.parent_id",
                        "manuscript_entities.sort",
                        "manuscript_entities.character_id",
                        "manuscript_entities.blueprint_instance_id",
                        "manuscript_entities.document_id",
                        "manuscript_entities.map_id",
                        "manuscript_entities.map_pin_id",
                        "manuscript_entities.graph_id",
                        "manuscript_entities.event_id",
                        "manuscript_entities.image_id",
                        () =>
                          sql<string>`COALESCE(characters.full_name, blueprint_instances.title, documents.title, maps.title,
                                          map_pins.title, graphs.title, events.title, images.title)`.as("title"),
                        () =>
                          sql<string>`CASE
                                        WHEN manuscript_entities.character_id IS NOT NULL THEN 'characters'
                                        WHEN manuscript_entities.blueprint_instance_id IS NOT NULL THEN 'blueprint_instances'
                                        WHEN manuscript_entities.document_id IS NOT NULL THEN 'documents'
                                        WHEN manuscript_entities.map_id IS NOT NULL THEN 'maps'
                                        WHEN manuscript_entities.map_pin_id IS NOT NULL THEN 'map_pins'
                                        WHEN manuscript_entities.graph_id IS NOT NULL THEN 'graphs'
                                        WHEN manuscript_entities.event_id IS NOT NULL THEN 'events'
                                        WHEN manuscript_entities.image_id IS NOT NULL THEN 'images'
                                      END  `.as("type"),
                      ])
                      .where("manuscript_entities.manuscript_id", "=", params.id),
                  ).as("entities"),
                );
              }
            }

            if (permissions.is_project_owner) {
              query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
            } else {
              query = checkEntityLevelPermission(query, permissions, "manuscripts", params.id);
            }
            if (body.permissions) {
              query = GetRelatedEntityPermissionsAndRoles(query, permissions, "manuscripts", params.id);
            }

            const data = await query.executeTakeFirst();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadManuscriptSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_manuscripts"),
          },
        )
        .post(
          "/update/:id",
          async ({ body, params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("manuscripts", params.id, permissions);

            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                await tx.updateTable("manuscripts").set(body.data).executeTakeFirstOrThrow();

                if (body.relations?.entities?.length) {
                  const existingEntities = await tx
                    .selectFrom("manuscript_entities")
                    .select([
                      "id",
                      "character_id",
                      "blueprint_instance_id",
                      "document_id",
                      "map_id",
                      "map_pin_id",
                      "graph_id",
                      "event_id",
                      "image_id",
                      "parent_id",
                      "sort",
                    ])
                    .where("manuscript_id", "=", params.id)
                    .execute();

                  const existingIds = existingEntities.map((field) => field.id);

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds,
                    body.relations?.entities,
                  );

                  if (idsToRemove.length) {
                    await tx.deleteFrom("manuscript_entities").where("id", "in", idsToRemove).execute();
                  }
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_entities")
                      .values(
                        itemsToAdd.map((item) => ({
                          ...item,
                          manuscript_id: params.id,
                        })),
                      )
                      .execute();
                  }
                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_entities")
                          .where("parent_id", "=", params.id)
                          .where("id", "=", item.id)
                          .set({ ...item, manuscript_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                } else {
                  await tx
                    .deleteFrom("manuscript_entities")
                    .where("manuscript_entities.manuscript_id", "=", params.id)
                    .execute();
                }

                if (body.relations?.tags?.length) {
                  const { tags } = body.relations;
                  await UpdateTagRelations({
                    tx,
                    relationalTable: "manuscript_tags",
                    id: params.id,
                    newTags: tags,
                    is_project_owner: permissions.is_project_owner,
                  });
                }
                if (body.permissions) {
                  await UpdateEntityPermissions(tx, params.id, body.permissions);
                }
              });
              return { ok: true, role_access: true, message: `Manuscript ${MessageEnum.successfully_created}` };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            beforeHandle: async (context) => beforeRoleHandler(context, "update_manuscripts"),
            body: UpdateManuscriptSchema,
            response: ResponseSchema,
          },
        ),
    );
}
