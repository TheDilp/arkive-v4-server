import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntityListSchema } from "../database/validation";
import { InsertMapSchema, ReadMapSchema, UpdateMapSchema } from "../database/validation/maps";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function map_router(app: Elysia) {
  return app.group("/maps", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const map = await tx.insertInto("maps").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations?.tags)
              await CreateTagRelations({ tx, relationalTable: "_mapsTotags", id: map.id, tags: body.relations.tags });
          });

          return { message: `Map ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertMapSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("maps")
            .where("project_id", "=", body.data.project_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "maps">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("maps", qb, body.filters);
              return qb;
            })
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
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("characters")
                            .whereRef("characters.id", "=", "map_pins.character_id")
                            .select(["id", "first_name", "last_name", "portrait_id"]),
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
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ReadMapSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await tx.updateTable("maps").where("id", "=", params.id).set(body.data).execute();
            }
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
          });

          return { message: `Map ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateMapSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("maps").where("maps.id", "=", params.id).execute();
          return { message: `Map ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
