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
import { noRoleAccessErrorHandler } from "../handlers";
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

              if (body.relations?.characters?.length) {
                await tx
                  .insertInto("manuscript_characters")
                  .values(
                    body.relations?.characters.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.blueprint_instances?.length) {
                await tx
                  .insertInto("manuscript_blueprint_instances")
                  .values(
                    body.relations?.blueprint_instances.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.documents?.length) {
                await tx
                  .insertInto("manuscript_documents")
                  .values(
                    body.relations?.documents.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.maps?.length) {
                await tx
                  .insertInto("manuscript_maps")
                  .values(
                    body.relations?.maps.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.map_pins?.length) {
                await tx
                  .insertInto("manuscript_map_pins")
                  .values(
                    body.relations?.map_pins.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.graphs?.length) {
                await tx
                  .insertInto("manuscript_graphs")
                  .values(
                    body.relations?.graphs.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.events?.length) {
                await tx
                  .insertInto("manuscript_events")
                  .values(
                    body.relations?.events.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.images?.length) {
                await tx
                  .insertInto("manuscript_images")
                  .values(
                    body.relations?.images.map((doc) => ({
                      ...doc,
                      parent_id: manuscript.id,
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
              if (body?.relations?.tags) {
                query = query.select((eb) =>
                  TagQuery(eb, "manuscript_tags", "manuscripts", permissions.is_project_owner, permissions.user_id),
                );
              }
              if (body?.relations?.entities) {
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_characters")
                      .where("manuscript_characters.parent_id", "=", params.id)
                      .leftJoin("characters", "characters.id", "manuscript_characters.related_id")
                      .select([
                        "manuscript_characters.id",
                        "manuscript_characters.parent_id",
                        "manuscript_characters.related_id",
                        "manuscript_characters.sort",
                        "characters.full_name as title",
                        "characters.portrait_id as image_id",
                        sql`'characters'::TEXT`.as("type"),
                      ]),
                  ).as("characters"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_blueprint_instances")
                      .where("manuscript_blueprint_instances.parent_id", "=", params.id)
                      .leftJoin("blueprint_instances", "blueprint_instances.id", "manuscript_blueprint_instances.related_id")
                      .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                      .select([
                        "manuscript_blueprint_instances.id",
                        "manuscript_blueprint_instances.parent_id",
                        "manuscript_blueprint_instances.related_id",
                        "manuscript_blueprint_instances.sort",
                        "blueprint_instances.title",
                        "blueprints.icon",
                        sql`'blueprint_instances'::TEXT`.as("type"),
                      ]),
                  ).as("blueprint_instances"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_documents")
                      .where("manuscript_documents.parent_id", "=", params.id)
                      .leftJoin("documents", "documents.id", "manuscript_documents.related_id")
                      .select([
                        "manuscript_documents.id",
                        "manuscript_documents.parent_id",
                        "manuscript_documents.related_id",
                        "manuscript_documents.sort",
                        "documents.title",
                        "documents.icon",
                        "documents.image_id",
                        sql`'documents'::TEXT`.as("type"),
                      ]),
                  ).as("documents"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_maps")
                      .where("manuscript_maps.parent_id", "=", params.id)
                      .leftJoin("maps", "maps.id", "manuscript_maps.related_id")
                      .select([
                        "manuscript_maps.id",
                        "manuscript_maps.parent_id",
                        "manuscript_maps.related_id",
                        "manuscript_maps.sort",
                        "maps.title",
                        "maps.icon",
                        "maps.image_id",
                        sql`'maps'::TEXT`.as("type"),
                      ]),
                  ).as("maps"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_map_pins")
                      .where("manuscript_map_pins.parent_id", "=", params.id)
                      .leftJoin("map_pins", "map_pins.id", "manuscript_map_pins.related_id")
                      .select([
                        "manuscript_map_pins.id",
                        "manuscript_map_pins.parent_id",
                        "manuscript_map_pins.related_id",
                        "manuscript_map_pins.sort",
                        "map_pins.title",
                        "map_pins.icon",
                        "map_pins.image_id",
                        sql`'map_pins'::TEXT`.as("type"),
                      ]),
                  ).as("map_pins"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_graphs")
                      .where("manuscript_graphs.parent_id", "=", params.id)
                      .leftJoin("graphs", "graphs.id", "manuscript_graphs.related_id")
                      .select([
                        "manuscript_graphs.id",
                        "manuscript_graphs.parent_id",
                        "manuscript_graphs.related_id",
                        "manuscript_graphs.sort",
                        "graphs.title",
                        "graphs.icon",
                        sql`'graphs'::TEXT`.as("type"),
                      ]),
                  ).as("graphs"),
                );

                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_events")
                      .where("manuscript_events.parent_id", "=", params.id)
                      .leftJoin("events", "events.id", "manuscript_events.related_id")
                      .select([
                        "manuscript_events.id",
                        "manuscript_events.parent_id",
                        "manuscript_events.related_id",
                        "manuscript_events.sort",
                        "events.title",
                        "events.image_id",
                        sql`'events'::TEXT`.as("type"),
                      ]),
                  ).as("events"),
                );
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("manuscript_images")
                      .where("manuscript_images.parent_id", "=", params.id)
                      .leftJoin("images", "images.id", "manuscript_images.related_id")
                      .select([
                        "manuscript_images.id",
                        "manuscript_images.parent_id",
                        "manuscript_images.related_id",
                        "manuscript_images.sort",
                        "images.title",

                        sql`'images'::TEXT`.as("type"),
                      ]),
                  ).as("images"),
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
          },
        )
        .post(
          "/update/:id",
          async ({ body, params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("manuscripts", params.id, permissions);

            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                await tx.updateTable("manuscripts").set(body.data).where("id", "=", params.id).executeTakeFirstOrThrow();

                if (body.relations?.characters) {
                  const existingIds = await tx
                    .selectFrom("manuscript_characters")
                    .select("id")
                    .where("manuscript_characters.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.characters || [],
                  );

                  if (idsToRemove.length) await tx.deleteFrom("manuscript_characters").where("id", "in", idsToRemove).execute();
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_characters")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_characters")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.blueprint_instances) {
                  const existingIds = await tx
                    .selectFrom("manuscript_blueprint_instances")
                    .select("id")
                    .where("manuscript_blueprint_instances.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.blueprint_instances || [],
                  );

                  if (idsToRemove.length)
                    await tx.deleteFrom("manuscript_blueprint_instances").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_blueprint_instances")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_blueprint_instances")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.documents) {
                  const existingIds = await tx
                    .selectFrom("manuscript_documents")
                    .select("id")
                    .where("manuscript_documents.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.documents || [],
                  );

                  if (idsToRemove.length) await tx.deleteFrom("manuscript_documents").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_documents")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_documents")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.maps) {
                  const existingIds = await tx
                    .selectFrom("manuscript_maps")
                    .select("id")
                    .where("manuscript_maps.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.maps || [],
                  );
                  if (idsToRemove.length) await tx.deleteFrom("manuscript_maps").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_maps")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_maps")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.map_pins) {
                  const existingIds = await tx
                    .selectFrom("manuscript_map_pins")
                    .select("id")
                    .where("manuscript_map_pins.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.map_pins || [],
                  );

                  if (idsToRemove.length) await tx.deleteFrom("manuscript_map_pins").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_map_pins")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_map_pins")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.graphs) {
                  const existingIds = await tx
                    .selectFrom("manuscript_graphs")
                    .select("id")
                    .where("manuscript_graphs.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.graphs || [],
                  );
                  if (idsToRemove.length) await tx.deleteFrom("manuscript_graphs").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_graphs")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_graphs")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.events) {
                  const existingIds = await tx
                    .selectFrom("manuscript_events")
                    .select("id")
                    .where("manuscript_events.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.events || [],
                  );
                  if (idsToRemove.length) await tx.deleteFrom("manuscript_events").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_events")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_events")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.images) {
                  const existingIds = await tx
                    .selectFrom("manuscript_images")
                    .select("id")
                    .where("manuscript_images.parent_id", "=", params.id)
                    .execute();

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds.map((item) => item.id),
                    body.relations?.images || [],
                  );
                  if (idsToRemove.length) await tx.deleteFrom("manuscript_images").where("id", "in", idsToRemove).execute();

                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("manuscript_images")
                      .values(
                        itemsToAdd.map((item) => ({
                          parent_id: params.id,
                          id: item.id,
                          sort: item.sort,
                          related_id: item.related_id,
                        })),
                      )
                      .execute();
                  }

                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("manuscript_images")
                          .where("id", "=", item.id)
                          .set({ ...item, parent_id: params.id })
                          .execute(),
                      ),
                    );
                  }
                }

                if (body.relations?.tags) {
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
            body: UpdateManuscriptSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("manuscripts", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("manuscripts")
                .where("manuscripts.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Manuscript ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
            const permissionCheck = await getHasEntityPermission("manuscripts", params.id, permissions);
            if (permissionCheck) {
              const data = await db
                .deleteFrom("manuscripts")
                .where("manuscripts.id", "=", params.id)
                .where("manuscripts.deleted_at", "is not", null)
                .returning(["id", "title", "project_id"])
                .executeTakeFirstOrThrow();

              return { data, message: `Manuscript ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
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
