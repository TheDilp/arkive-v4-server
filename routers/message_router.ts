import Elysia from "elysia";
import { SelectExpression } from "kysely";
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
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function message_router(app: Elysia) {
  return app.group("/messages", (server) =>
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
        async ({ body }) => {
          const data = await db
            .selectFrom("messages")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "messages">[]))
            .where("messages.parent_id", "=", body.data.conversation_id)
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
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
