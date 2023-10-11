import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertConversationSchema, ListConversationSchema, ReadConversationSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";

export function conversation_router(app: Elysia) {
  return app.group("/conversations", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          const conversation = await db
            .insertInto("conversations")
            .values(body.data)
            .returning(["id"])
            .executeTakeFirstOrThrow();

          await db
            .insertInto("_charactersToconversations")
            .values(body.relations.characters.map((char) => ({ A: char.id, B: conversation.id })))
            .execute();

          return { message: `Conversation ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertConversationSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("conversations")
            .where("project_id", "=", body.data.project_id)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "conversations">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) =>
              constructFilter("conversations", qb, body.filters),
            )
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.characters) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("_charactersToconversations")
                      .whereRef("conversations.id", "=", "_charactersToconversations.B")
                      .leftJoin("characters", "characters.id", "_charactersToconversations.A")
                      .select(["characters.id", "characters.first_name", "characters.last_name", "characters.portrait_id"]),
                  ).as("characters"),
                );
              }
              if (body?.relations?.messages) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("messages")
                      .whereRef("messages.parent_id", "=", "conversations.id")
                      .select(["messages.id", "messages.content", "messages.sender_id"]),
                  ).as("messages"),
                );
              }
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ListConversationSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("conversations")
            .where("id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "conversations">[]))

            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.characters) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("_charactersToconversations")
                      .whereRef("conversations.id", "=", "_charactersToconversations.B")
                      .leftJoin("characters", "characters.id", "_charactersToconversations.A")
                      .select(["characters.id", "characters.first_name", "characters.last_name", "characters.portrait_id"]),
                  ).as("characters"),
                );
              }
              if (body?.relations?.messages) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("messages")
                      .whereRef("messages.parent_id", "=", "conversations.id")
                      .select(["messages.id", "messages.content", "messages.sender_id"]),
                  ).as("messages"),
                );
              }
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ReadConversationSchema, response: ResponseWithDataSchema },
      ),
  );
}
