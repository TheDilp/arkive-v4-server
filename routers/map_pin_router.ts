import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertMapPinSchema, InsertMapPinType, UpdateMapPinSchema, UpdateMapPinType } from "../database/validation/map_pins";

export function map_pin_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertMapPinType; relations?: { tags?: string[] } } }>, rep) => {
      const data = InsertMapPinSchema.parse(req.body.data);

      await db.transaction().execute(async (tx) => {
        const map_pin = await tx.insertInto("map_pins").values(data).returning("id").executeTakeFirstOrThrow();

        if (req.body?.relations?.tags) {
          const { tags } = req.body.relations;
          await tx
            .insertInto("_map_pinsTotags")
            .values(tags.map((tag) => ({ A: map_pin.id, B: tag })))
            .execute();
        }
      });
      rep.send({ message: "Map pin successfully created.", ok: true });
    },
  );

  // #endregion create_routes
  // #region read_routes
  server.post(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: { relations?: { tags?: boolean } } }>, rep) => {
      const data = await db
        .selectFrom("map_pins")
        .selectAll()
        .where("map_pins.id", "=", req.params.id)
        .executeTakeFirstOrThrow();
      rep.send({ data, message: "Success.", ok: true });
    },
  );
  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateMapPinType; relations?: { tags?: boolean } } }>,
      rep,
    ) => {
      const data = UpdateMapPinSchema.parse(req.body.data);
      await db.updateTable("map_pins").set(data).where("map_pins.id", "=", req.params.id).executeTakeFirstOrThrow();

      rep.send({ message: "Map pin successfully updated.", ok: true });
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
      await db.deleteFrom("map_pins").where("map_pins.id", "=", req.params.id).execute();
      rep.send({ message: "Map pin successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes
  done();
}
