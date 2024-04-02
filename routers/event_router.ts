import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { InsertEventSchema, ListEventSchema, ReadEventSchema, UpdateEventSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, eventRelationFilters } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/transform";

export function event_router(app: Elysia) {
  return app.group("/events", (server) =>
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
          if (body) {
            await db.transaction().execute(async (tx) => {
              const { id } = await tx
                .insertInto("events")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning(["id"])
                .executeTakeFirstOrThrow();

              if (body?.relations?.tags?.length) {
                const { tags } = body.relations;
                await tx
                  .insertInto("_eventsTotags")
                  .values(tags.map((tag) => ({ A: id, B: tag.id })))
                  .execute();
              }
              if (body?.relations?.characters?.length) {
                const { characters } = body.relations;
                await tx
                  .insertInto("event_characters")
                  .values(characters.map((char) => ({ event_id: id, related_id: char.id })))
                  .execute();
              }
              if (body?.relations?.map_pins?.length) {
                const { map_pins } = body.relations;
                await tx
                  .insertInto("event_map_pins")
                  .values(map_pins.map((map_pin) => ({ event_id: id, related_id: map_pin.id })))
                  .execute();
              }
            });
          }
          const data = await db
            .selectFrom("calendars")
            .select(["project_id"])
            .where("id", "=", body.data.parent_id)
            .executeTakeFirstOrThrow();
          return {
            data: { title: body.data.title, project_id: data.project_id },
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        {
          body: InsertEventSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "create_events"),
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          let query = db
            .selectFrom("events")
            .distinctOn(body.orderBy ? ([...body.orderBy.map((o) => o.field), "events.id"] as any) : ["events.id"])
            .select(body.fields.map((f) => `events.${f}`) as SelectExpression<DB, "events">[]);

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("events", query, body.filters);
          }
          if (!!body?.relationFilters?.and?.length || !!body?.relationFilters?.or?.length) {
            const { characters, map_pins } = groupRelationFiltersByField(body.relationFilters || {});

            if (characters?.filters?.length) query = eventRelationFilters("event_characters", query, characters?.filters || []);
            if (map_pins?.filters?.length) query = eventRelationFilters("event_map_pins", query, map_pins?.filters || []);
          }
          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }
          if (body.relations) {
            if (body?.relations?.tags) {
              query = query.select((eb) => TagQuery(eb, "_eventsTotags", "events"));
            }
            if (body?.relations?.document) {
              query = query.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("documents")
                    .whereRef("documents.id", "=", "events.document_id")
                    .select(["id", "title", "icon"]),
                ).as("document"),
              );
            }
            if (body?.relations?.characters) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("event_characters")
                    .leftJoin("characters", "characters.id", "event_characters.related_id")
                    .whereRef("event_characters.event_id", "=", "events.id")
                    .select(["id", "full_name", "portrait_id"]),
                ).as("characters"),
              );
            }
            if (body?.relations?.map_pins) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("event_map_pins")
                    .leftJoin("map_pins", "map_pins.id", "event_map_pins.related_id")
                    .whereRef("event_map_pins.event_id", "=", "events.id")
                    .select(["map_pins.id", "map_pins.title", "map_pins.image_id", "icon", "border_color", "map_pins.color"]),
                ).as("map_pins"),
              );
            }
          }
          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "events");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            GetRelatedEntityPermissionsAndRoles(query, permissions, "events");
          }

          query = query
            .leftJoin("months as sm", "events.start_month_id", "sm.id")
            .leftJoin("months as em", "events.end_month_id", "em.id")
            .select(["sm.sort as start_month", "em.sort as end_month"]);

          const data = await query.execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListEventSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_events"),
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          let query = db
            .selectFrom("events")
            .where("events.id", "=", params.id)
            .clearSelect()
            .select(body.fields as SelectExpression<DB, "events">[]);

          if (body?.relations) {
            if (body?.relations?.tags) {
              query = query.select((eb) => TagQuery(eb, "_eventsTotags", "events"));
            }
            if (body?.relations?.document) {
              query = query.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("documents")
                    .whereRef("documents.id", "=", "events.document_id")
                    .select(["id", "title", "icon"]),
                ).as("document"),
              );
            }
            if (body?.relations?.image) {
              query = query.select((eb) =>
                jsonObjectFrom(
                  eb.selectFrom("images").whereRef("images.id", "=", "events.image_id").select(["id", "title"]),
                ).as("image"),
              );
            }
            if (body?.relations?.characters) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("event_characters")
                    .leftJoin("characters", "characters.id", "event_characters.related_id")
                    .where("event_characters.event_id", "=", params.id)
                    .select(["id", "full_name", "portrait_id"]),
                ).as("characters"),
              );
            }
            if (body?.relations?.map_pins) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("event_map_pins")
                    .leftJoin("map_pins", "map_pins.id", "event_map_pins.related_id")
                    .where("event_map_pins.event_id", "=", params.id)
                    .select([
                      "map_pins.id",
                      "map_pins.title",
                      "map_pins.image_id",
                      "icon",
                      "border_color",
                      "map_pins.background_color",
                    ]),
                ).as("map_pins"),
              );
            }
          }

          const data = await query.executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadEventSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_events"),
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("events", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("events").where("id", "=", params.id).set(body.data).execute();
              if (body?.relations?.tags?.length) {
                UpdateTagRelations({
                  relationalTable: "_eventsTotags",
                  id: params.id,
                  newTags: body.relations?.tags,
                  tx,
                });
              } else await tx.deleteFrom("_eventsTotags").where("A", "=", params.id).execute();

              if (body?.relations?.characters) {
                const { characters } = body.relations;
                const existingCharacters = await tx
                  .selectFrom("event_characters")
                  .select(["related_id"])
                  .where("event_characters.event_id", "=", params.id)
                  .execute();

                const existingIds = existingCharacters.map((char) => char.related_id);

                const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, characters);

                if (idsToRemove.length) {
                  await tx.deleteFrom("event_characters").where("related_id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("event_characters")
                    .values(
                      itemsToAdd.map((char) => ({
                        event_id: params.id,
                        related_id: char.id,
                      })),
                    )
                    .execute();
                }
              }
              if (body?.relations?.map_pins) {
                const { map_pins } = body.relations;
                const existingMapPins = await tx
                  .selectFrom("event_map_pins")
                  .select(["related_id as id"])
                  .where("event_map_pins.event_id", "=", params.id)
                  .execute();

                const existingIds = existingMapPins.map((map_pin) => map_pin.id);

                const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, map_pins);

                if (idsToRemove.length) {
                  await tx.deleteFrom("event_map_pins").where("related_id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("event_map_pins")
                    .values(
                      itemsToAdd.map((char) => ({
                        event_id: params.id,
                        related_id: char.id,
                      })),
                    )
                    .execute();
                }
              }
              if (body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, "event_permissions", body.permissions);
              }
            });
            return { message: `Event ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          body: UpdateEventSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "update_events"),
        },
      )
      .delete(
        "/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("events", params.id, permissions);
          if (permissionCheck) {
            const res = await db
              .deleteFrom("events")
              .where("events.id", "=", params.id)
              .returning(["events.parent_id", "events.title"])
              .executeTakeFirstOrThrow();

            const data = await db
              .selectFrom("calendars")
              .where("id", "=", res.parent_id)
              .select(["project_id"])
              .executeTakeFirstOrThrow();

            return { data, message: `Event ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { data: {}, message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "delete_events"),
        },
      ),
  );
}
