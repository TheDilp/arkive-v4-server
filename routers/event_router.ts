import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntityListSchema, InsertEventSchema, ReadEventSchema, UpdateEventSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelationsForUpdating, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function event_router(app: Elysia) {
  return app.group("/events", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          if (body) {
            await db.transaction().execute(async (tx) => {
              const { id } = await tx.insertInto("events").values(body.data).returning(["id"]).executeTakeFirstOrThrow();

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
                  .values(characters.map((char) => ({ event_id: id, character_id: char.id })))
                  .execute();
              }
              if (body?.relations?.map_pins?.length) {
                const { map_pins } = body.relations;
                await tx
                  .insertInto("event_map_pins")
                  .values(map_pins.map((map_pin) => ({ event_id: id, map_pin_id: map_pin.id })))
                  .execute();
              }
            });
          }
          const data = await db
            .selectFrom("calendars")
            .select(["project_id"])
            .where("id", "=", body.data.parent_id)
            .executeTakeFirstOrThrow();
          return { data: { title: body.data.title, project_id: data.project_id }, message: MessageEnum.success, ok: true };
        },
        {
          body: InsertEventSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("events")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields.map((f) => `events.${f}`) as SelectExpression<DB, "events">[]),
            )
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("events", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .leftJoin("months as sm", "events.start_month_id", "sm.id")
            .leftJoin("months as em", "events.end_month_id", "em.id")
            .select(["sm.sort as start_month", "em.sort as end_month"])
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("events")
            .where("events.id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_eventsTotags", "events"));
              }
              if (body?.relations?.document) {
                qb = qb.select((eb) =>
                  jsonObjectFrom(
                    eb
                      .selectFrom("documents")
                      .whereRef("documents.id", "=", "events.document_id")
                      .select(["id", "title", "icon"]),
                  ).as("document"),
                );
              }
              if (body?.relations?.image) {
                qb = qb.select((eb) =>
                  jsonObjectFrom(
                    eb.selectFrom("images").whereRef("images.id", "=", "events.image_id").select(["id", "title"]),
                  ).as("image"),
                );
              }
              if (body?.relations?.characters) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("event_characters")
                      .leftJoin("characters", "characters.id", "event_characters.character_id")
                      .where("event_characters.event_id", "=", params.id)
                      .select(["id", "full_name", "portrait_id"]),
                  ).as("characters"),
                );
              }
              if (body?.relations?.map_pins) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("event_map_pins")
                      .leftJoin("map_pins", "map_pins.id", "event_map_pins.map_pin_id")
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

              return qb;
            })
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadEventSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          if (body) {
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
                  .select(["character_id"])
                  .where("event_characters.event_id", "=", params.id)
                  .execute();

                const existingIds = existingCharacters.map((char) => char.character_id);

                const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, characters);

                if (idsToRemove.length) {
                  await tx.deleteFrom("event_characters").where("character_id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("event_characters")
                    .values(
                      itemsToAdd.map((char) => ({
                        event_id: params.id,
                        character_id: char.id,
                      })),
                    )
                    .execute();
                }
              }
              if (body?.relations?.map_pins) {
                const { map_pins } = body.relations;
                const existingMapPins = await tx
                  .selectFrom("event_map_pins")
                  .select(["map_pin_id as id"])
                  .where("event_map_pins.event_id", "=", params.id)
                  .execute();

                const existingIds = existingMapPins.map((map_pin) => map_pin.id);

                const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, map_pins);

                if (idsToRemove.length) {
                  await tx.deleteFrom("event_map_pins").where("map_pin_id", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("event_map_pins")
                    .values(
                      itemsToAdd.map((char) => ({
                        event_id: params.id,
                        map_pin_id: char.id,
                      })),
                    )
                    .execute();
                }
              }
            });
          }
          return { message: `Event ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateEventSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
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

          return { data, message: `Event ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
