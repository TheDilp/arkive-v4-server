import Elysia from "elysia";

import { db } from "../database/db";
import { InsertWebhookSchema, ListWebhookSchema, ReadWebhookSchema } from "../database/validation/webhooks";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function webhook_router(app: Elysia) {
  return app.group("/webhooks", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("webhooks").values(body.data).execute();

          return { message: `Webhook ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertWebhookSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db.selectFrom("webhooks").selectAll().where("user_id", "=", body.data.user_id).execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListWebhookSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ body }) => {
          const data = await db.selectFrom("webhooks").where("id", "=", body.data.id).executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadWebhookSchema,
          response: ResponseWithDataSchema,
        },
      ),
  );
}
