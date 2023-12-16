import Elysia from "elysia";

import { db } from "../database/db";
import { InsertMapPinTypeSchema, UpdateMapPinTypeSchema } from "../database/validation/map_pin_types";
import { MessageEnum } from "../enums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function map_pin_types_router(app: Elysia) {
  return app.group("/map_pin_types", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("map_pin_types").values(body.data).execute();

          return { message: `Map pin type ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertMapPinTypeSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:id",
        async ({ params }) => {
          const data = await db
            .selectFrom("map_pin_types")
            .where("id", "=", params.id)
            .select(["id", "title", "project_id"])
            .executeTakeFirstOrThrow();

          return { data, message: `Map pin type ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("map_pin_types").where("id", "=", params.id).set(body.data).execute();

          return { message: `Map pin type ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateMapPinTypeSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/delete/:id",
        async ({ params }) => {
          await db.deleteFrom("map_pin_types").where("id", "=", params.id).execute();

          return { message: `Map pin type ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
