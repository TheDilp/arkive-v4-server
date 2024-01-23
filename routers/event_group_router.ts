import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertEventGroupSchema,
  ListEventGroupSchema,
  ReadEventGroupSchema,
  UpdateEventGroupSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function event_group_router(app: Elysia) {
  return app.group("/event_groups", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("event_groups").values(body.data).execute();

          return { message: MessageEnum.success, ok: true };
        },
        {
          body: InsertEventGroupSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("event_groups")
            .select(body.fields as SelectExpression<DB, "event_groups">[])
            .where("project_id", "=", body.data.project_id)
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListEventGroupSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ body }) => {
          const data = await db
            .selectFrom("event_groups")
            .select(body.fields as SelectExpression<DB, "event_groups">[])
            .where("id", "=", body.data.id)
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadEventGroupSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update",
        async ({ body }) => {
          const data = await db.updateTable("event_groups").where("id", "=", body.data.id).set(body.data).execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: UpdateEventGroupSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("event_groups").where("id", "=", params.id).execute();

          return { message: MessageEnum.success, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
