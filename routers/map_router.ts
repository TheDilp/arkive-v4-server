import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertMapSchema, InsertMapType, UpdateMapSchema, UpdateMapType } from "../database/validation/maps";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function map_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertMapType; relations?: { tags?: string[] } } }>, rep) => {
      const data = InsertMapSchema.parse(req.body.data);

      await db.transaction().execute(async (tx) => {
        const map = await tx.insertInto("maps").values(data).returning("id").executeTakeFirstOrThrow();

        if (req.body?.relations?.tags)
          await CreateTagRelations({ tx, relationalTable: "_mapsTotags", id: map.id, tags: req.body.relations.tags });
      });

      rep.send({ message: "Map successfully created.", ok: true });
    },
  );
  // #endregion create_routes

  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("maps")
      .$if(!req.body.fields.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "maps">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("maps", qb, req.body.filters);
        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("maps")
      .$if(!req.body.fields.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "maps">[]))
      .where("maps.id", "=", req.params.id)
      .$if(!!req.body?.relations?.map_pins, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("map_pins").selectAll().whereRef("map_pins.parent_id", "=", "maps.id")).as("map_pins"),
        ),
      )
      .$if(!!req.body?.relations?.map_layers, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("map_layers").selectAll().whereRef("map_layers.parent_id", "=", "maps.id")).as(
            "map_layers",
          ),
        ),
      )
      .$if(!!req.body?.relations?.images, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(eb.selectFrom("images").select(["id", "title"]).whereRef("maps.image_id", "=", "images.id")).as(
            "images",
          ),
        ),
      )
      .$if(!!req.body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_mapsTotags", "maps")))
      .executeTakeFirstOrThrow();
    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateMapType; relations?: { tags?: string[] } } }>,
      rep,
    ) => {
      const data = UpdateMapSchema.parse(req.body.data);

      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const parsedData = UpdateMapSchema.parse(req.body.data);
          await tx.updateTable("maps").set(parsedData).executeTakeFirstOrThrow();
        }
        if (req.body?.relations) {
          if (req.body.relations?.tags)
            UpdateTagRelations({ relationalTable: "_mapsTotags", id: req.params.id, newTags: req.body.relations.tags, tx });
        }
      });

      rep.send({ data, message: "Success.", ok: true });
    },
  );
  // #endregion update_routes

  // #region delete_routes

  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep,
    ) => {
      await db.deleteFrom("maps").where("maps.id", "=", req.params.id).execute();
      rep.send({ message: "Map successfully deleted.", ok: true });
    },
  );

  // #endregion delete_routes

  done();
}
