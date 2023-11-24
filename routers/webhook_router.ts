import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertWebhookSchema, ListWebhookSchema, ReadWebhookSchema, SendWebhookSchema } from "../database/validation/webhooks";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { createEntityURL, getDefaultEntityIcon, getIconUrlFromIconEnum, getImageURL } from "../utils/transform";

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
          const data = await db
            .selectFrom("webhooks")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "webhooks">[]))
            .where("user_id", "=", body.data.user_id)
            .execute();
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
          const data = await db.selectFrom("webhooks").selectAll().where("id", "=", body.data.id).executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadWebhookSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/send/:id",
        async ({ params, body }) => {
          const { url } = await db.selectFrom("webhooks").select("url").where("id", "=", params.id).executeTakeFirstOrThrow();

          let content: { [key: string]: any } = {};

          if (body.data.type === "document_text") {
            content.title = body.data.title;
            content.description = body.data.description;
          } else if (body.data.type === "document") {
            const data = await db
              .selectFrom("documents")
              .where("id", "=", body.data.id)
              .select(["id", "title", "image_id", "icon", "project_id"])
              .executeTakeFirstOrThrow();
            content.url = `${createEntityURL(data.project_id, "documents", data.id)}`;
            content.title = data.title;
            if (data?.image_id) content.thumbnail = { url: getImageURL(data.project_id, "images", data.image_id) };
            else content.thumbnail = { url: getIconUrlFromIconEnum(data.icon || getDefaultEntityIcon("documents")) };
          } else if (body.data.type === "image") {
            const data = await db
              .selectFrom("images")
              .where("id", "=", body.data.id)
              .select(["images.id", "images.title", "images.project_id"])
              .executeTakeFirstOrThrow();
            content.title = data.title;

            if (data.project_id) {
              content.image = { url: getImageURL(data.project_id, "images", data.id) };
            }
          }
          await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              embeds: [content],
            }),
          });

          return { message: MessageEnum.success, ok: true };
        },
        { body: SendWebhookSchema, response: ResponseSchema },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("webhooks").where("id", "=", params.id).execute();
          return { message: `Webhook ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
