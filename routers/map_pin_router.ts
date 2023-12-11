import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertMapPinSchema, ListMapPinSchema, UpdateMapPinSchema } from "../database/validation/map_pins";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";

export function map_pin_router(app: Elysia) {
  return app.group("/map_pins", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const map_pin = await tx.insertInto("map_pins").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations?.tags) {
              const { tags } = body.relations;
              await tx
                .insertInto("_map_pinsTotags")
                .values(tags.map((tag) => ({ A: map_pin.id, B: tag.id })))
                .execute();
            }
          });
          return { message: `Map pin ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertMapPinSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("map_pins")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "map_pins">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("map_pins", qb, body.filters);
              return qb;
            })
            .$if(!!body?.relations?.character, (qb) =>
              qb.select([
                (eb) =>
                  jsonObjectFrom(
                    eb
                      .selectFrom("characters")
                      .whereRef("characters.id", "=", "map_pins.character_id")
                      .select(["id", "full_name", "portrait_id"]),
                  ).as("character"),
              ]),
            )
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListMapPinSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post("/:id", async ({ params }) => {
        const data = await db
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
            (eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom("characters")
                  .whereRef("characters.id", "=", "map_pins.character_id")
                  .select(["id", "full_name", "portrait_id"]),
              ).as("character"),
            (eb) =>
              jsonObjectFrom(
                eb.selectFrom("documents").whereRef("documents.id", "=", "map_pins.doc_id").select(["id", "title"]),
              ).as("document"),
            (eb) =>
              jsonObjectFrom(
                eb.selectFrom("maps").whereRef("maps.id", "=", "map_pins.map_link").select(["id", "title", "image_id"]),
              ).as("linked_map"),
          ])
          .where("map_pins.id", "=", params.id)
          .executeTakeFirstOrThrow();
        return { data, message: MessageEnum.success, ok: true };
      })
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("map_pins").set(body.data).where("map_pins.id", "=", params.id).executeTakeFirstOrThrow();

          return { message: `Map pin ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateMapPinSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("map_pins").where("map_pins.id", "=", params.id).execute();
        return { message: `Map pin ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
