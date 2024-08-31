import { Elysia } from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertMessageSchema,
  ListMessagesSchema,
  ReadMessageSchema,
  UpdateMessageSchema,
} from "../database/validation/messages";
import { MessageEnum } from "../enums/requestEnums";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function message_router(app: Elysia) {
  return app
    .decorate("permissions", {
      user_id: "",
      project_id: null,
      is_project_owner: false,
      role_access: false,
      role_id: null,
      permission_id: null,
      all_permissions: {},
    } as PermissionDecorationType)
    .group("/messages", (server) =>
      server
        .post(
          "/create",
          async ({ body }) => {
            await db.insertInto("messages").values(body.data).execute();
            return { message: MessageEnum.success, ok: true, role_access: true };
          },
          { body: InsertMessageSchema, response: ResponseSchema },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("messages")
              .distinctOn(
                body.orderBy?.length
                  ? (["messages.id", ...body.orderBy.map((order) => `messages.${order.field}`)] as any)
                  : "messages.id",
              )
              .leftJoin("characters", "characters.id", "messages.sender_id")
              .leftJoin("entity_permissions", "entity_permissions.related_id", "characters.id")
              .leftJoin(
                "entity_permissions as entity_portrait_permissions",
                "entity_portrait_permissions.related_id",
                "characters.portrait_id",
              )
              .leftJoin("permissions", "entity_permissions.permission_id", "permissions.id")
              .leftJoin(
                "permissions as portrait_permissions",
                "entity_portrait_permissions.permission_id",
                "portrait_permissions.id",
              )
              // @ts-ignore
              .select([
                "messages.id",
                "messages.content",
                "messages.sender_id",
                "messages.type",
                sql<string>`
                  CASE
                    WHEN ${sql.lit(permissions.is_project_owner)} THEN characters.full_name
                    WHEN entity_permissions.user_id = ${sql.lit(permissions.user_id)}
                      AND
                    permissions.code = 'read_characters' THEN full_name
                    ELSE '???'
                  END AS full_name`,
                sql<string | null>`
                  CASE
                    WHEN ${sql.lit(permissions.is_project_owner)} THEN characters.portrait_id
                    WHEN entity_portrait_permissions.user_id = ${sql.lit(permissions.user_id)}
                      AND
                    portrait_permissions.code = 'read_assets' THEN portrait_id
                    ELSE NULL
                  END AS portrait_id`,
              ])
              .where("messages.parent_id", "=", body.data.conversation_id)
              .$if(!!body.orderBy?.length, (qb) =>
                constructOrdering(
                  (body?.orderBy || []).map((order) => ({ field: `messages.${order.field}`, sort: order.sort })),
                  qb,
                ),
              )
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .limit(body.pagination?.limit || 10)
              .execute();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          { body: ListMessagesSchema, response: ResponseWithDataSchema },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            const data = await db
              .selectFrom("messages")
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "messages">[]))
              .$if(!!body?.relations, (qb) => {
                if (body?.relations?.character) {
                  qb = qb.select((eb) =>
                    jsonObjectFrom(
                      eb
                        .selectFrom("characters")
                        .whereRef("characters.id", "=", "messages.sender_id")
                        .select(["characters.id", "characters.first_name", "characters.last_name", "characters.portrait_id"]),
                    ).as("character"),
                  );
                }
                return qb;
              })
              .where("messages.id", "=", params.id)
              .executeTakeFirstOrThrow();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadMessageSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/update/:id",
          async ({ params, body }) => {
            await db.updateTable("messages").set(body.data).where("messages.id", "=", params.id).execute();
            return { message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: UpdateMessageSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/:id",
          async ({ params }) => {
            await db.deleteFrom("messages").where("id", "=", params.id).execute();
            return { message: `Message ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
          },
          {
            response: ResponseSchema,
          },
        ),
    );
}
