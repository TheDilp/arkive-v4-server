import { Elysia } from "elysia";

import { db } from "../database/db";
import { InsertMapPinTypeSchema, ListMapPinTypeSchema, UpdateMapPinTypeSchema } from "../database/validation/map_pin_types";
import { MessageEnum } from "../enums";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function map_pin_types_router(app: Elysia) {
  return app.group("/map_pin_types", (server) =>
    server
      .decorate("permissions", {
        user_id: "",
        project_id: null,
        is_project_owner: false,
        role_access: false,
        role_id: null,
        permission_id: null,
        all_permissions: {},
      } as PermissionDecorationType)
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("map_pin_types").values(body.data).execute();

          return { message: `Map pin type ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertMapPinTypeSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ permissions }) => {
          const data = await db
            .selectFrom("map_pin_types")
            .where("project_id", "=", permissions.project_id)
            .select(["id", "title", "default_icon", "default_icon_color"])
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListMapPinTypeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params }) => {
          const data = await db
            .selectFrom("map_pin_types")
            .where("id", "=", params.id)
            .select(["id", "title", "project_id", "default_icon", "default_icon_color"])
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("map_pin_types").where("id", "=", params.id).set(body.data).execute();

          return { message: `Map pin type ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
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

          return { message: `Map pin type ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
