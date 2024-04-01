import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertWebhookSchema,
  ListWebhookSchema,
  ReadWebhookSchema,
  SendWebhookSchema,
  UpdateWebhookSchema,
} from "../database/validation/webhooks";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import {
  createEntityURL,
  extractDocumentText,
  getDefaultEntityIcon,
  getIconUrlFromIconEnum,
  getImageURL,
} from "../utils/transform";

export function webhook_router(app: Elysia) {
  return app.group("/webhooks", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("webhooks").values(body.data).execute();

          return { message: `Webhook ${MessageEnum.successfully_created}`, ok: true, role_access: true };
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
            .select(body.fields as SelectExpression<DB, "webhooks">[])
            .where("user_id", "=", body.data.user_id)
            .execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
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
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadWebhookSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("webhooks").where("id", "=", params.id).set(body.data).execute();

          return { message: `Webhook ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: UpdateWebhookSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/send/:id",
        async ({ params, body }) => {
          const { url } = await db
            .selectFrom("webhooks")
            .leftJoin("users", "users.id", "webhooks.user_id")
            .select(["url"])
            .where("webhooks.id", "=", params.id)
            .executeTakeFirstOrThrow();

          let content: { [key: string]: any } = {};

          if (body.data.type === "characters") {
            const data = await db
              .selectFrom("characters")
              .where("id", "=", body.data.id)
              .select(["id", "full_name", "biography", "portrait_id", "project_id"])
              .executeTakeFirstOrThrow();

            content.url = `${createEntityURL(data.project_id, "characters", data.id)}`;
            content.title = `${data.full_name} (Character)`;
            content.description = extractDocumentText(data.biography) || "";
            if (data?.portrait_id) content.image = { url: getImageURL(data.project_id, "images", data.portrait_id) };
          } else if (body.data.type === "document_text") {
            content.title = body.data.title;
            content.description = body.data.description;
          } else if (body.data.type === "documents") {
            const data = await db
              .selectFrom("documents")
              .where("id", "=", body.data.id)
              .select(["id", "title", "content", "image_id", "icon", "project_id"])
              .executeTakeFirstOrThrow();
            content.url = `${createEntityURL(data.project_id, "documents", data.id)}`;
            content.title = `${data.title} (Document)`;
            content.description = extractDocumentText(data.content) || "";
            if (data?.image_id) content.image = { url: getImageURL(data.project_id, "images", data.image_id) };
            else content.thumbnail = { url: getIconUrlFromIconEnum(data.icon || getDefaultEntityIcon("documents")) };
          } else if (body.data.type === "maps") {
            const data = await db
              .selectFrom("maps")
              .where("id", "=", body.data.id)
              .select(["id", "title", "image_id", "icon", "project_id"])
              .executeTakeFirstOrThrow();

            content.title = `${data.title} (Map)`;
            content.url = `${createEntityURL(data.project_id, "maps", data.id)}`;
            content.thumbnail = { url: getIconUrlFromIconEnum(data.icon || getDefaultEntityIcon("maps")) };

            if (data?.image_id) content.image = { url: getImageURL(data.project_id, "map_images", data.image_id) };
          } else if (body.data.type === "images") {
            const data = await db
              .selectFrom("images")
              .where("id", "=", body.data.id)
              .select(["images.id", "images.title", "images.project_id"])
              .executeTakeFirstOrThrow();
            content.title = data.title;

            if (data.project_id) {
              content.image = { url: getImageURL(data.project_id, "images", data.id) };
            }
          } else if (body.data.type === "random_table_roll") {
            content.title = body.data.title;
            content.description = body.data?.description ?? "";
          } else if (body.data.type === "words") {
            const data = await db.selectFrom("words").select(["title", "description", "translation"]).executeTakeFirstOrThrow();
            content.title = `${data.title} (${data.translation})`;
            if (data?.description) content.description = data.description;
          } else if (body.data.type === "dictionaries") {
            const data = await db
              .selectFrom("dictionaries")
              .where("id", "=", body.data.id)
              .select(["id", "title", "icon", "project_id"])
              .executeTakeFirstOrThrow();

            content.title = `${data.title} (Dictionary)`;
            content.url = `${createEntityURL(data.project_id, "dictionaries", data.id)}`;
            content.thumbnail = { url: getIconUrlFromIconEnum(data.icon || getDefaultEntityIcon("dictionaries")) };
          } else if (body.data.type === "blueprint_instances") {
            const data = await db
              .selectFrom("blueprint_instances")
              .where("blueprint_instances.id", "=", body.data.id)
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .select(["blueprint_instances.id", "blueprint_instances.title", "blueprints.icon", "blueprints.project_id"])
              .executeTakeFirstOrThrow();

            content.title = `${data.title} (Blueprint instance)`;
            if (data.project_id) content.url = `${createEntityURL(data.project_id, "blueprint_instances", data.id)}`;
            content.thumbnail = { url: getIconUrlFromIconEnum(data.icon || getDefaultEntityIcon("dictionaries")) };
          } else if (body.data.type === "graphs") {
            const data = await db
              .selectFrom("graphs")
              .where("id", "=", body.data.id)
              .select(["id", "title", "project_id"])
              .executeTakeFirstOrThrow();
            content.url = `${createEntityURL(data.project_id, "graphs", data.id)}`;
            content.title = `${data.title} (Graph)`;
            content.thumbnail = { url: getIconUrlFromIconEnum(getDefaultEntityIcon("graphs")) };
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

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: SendWebhookSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("webhooks").where("id", "=", params.id).execute();
          return { message: `Webhook ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
