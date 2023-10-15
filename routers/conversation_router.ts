import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertConversationSchema,
  ListConversationSchema,
  ReadConversationSchema,
  UpdateConversationSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { afterCreateHandler, afterDeleteHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelationsForUpdating } from "../utils/relationalQueryHelpers";

export function conversation_router(app: Elysia) {
  return app.group("/conversations", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const conversation = await tx
              .insertInto("conversations")
              .values(body.data)
              .returning(["id", "title"])
              .executeTakeFirstOrThrow();

            await tx
              .insertInto("_charactersToconversations")
              .values(body.relations.characters.map((char) => ({ A: char.id, B: conversation.id })))
              .execute();
          });

          return { message: `Conversation ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          afterHandle: (args) => afterCreateHandler(args, "conversations"),
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
            .leftJoin("_charactersToconversations", "_charactersToconversations.B", "conversations.id")
            .where("_charactersToconversations.A", "=", body.data.character_id)
            .distinctOn("conversations.id")
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
                      .select(["messages.id", "messages.content", "messages.sender_id", "messages.type"])
                      .limit(30)
                      .orderBy("messages.created_at", "desc"),
                  ).as("messages"),
                );
              }
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
            .executeTakeFirstOrThrow();
          const sortedMessages = [...(data.messages || [])].reverse();
          data.messages = sortedMessages;
          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ReadConversationSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            await tx.updateTable("conversations").where("conversations.id", "=", params.id).set(body.data).execute();
            if (body.relations?.characters) {
              const existingCharactersInConversations = await tx
                .selectFrom("_charactersToconversations")
                .select(["A", "B"])
                .where("B", "=", params.id)
                .execute();
              const existingIds = existingCharactersInConversations.map((char) => char.A);
              const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, body.relations?.characters);

              if (idsToRemove.length) {
                await tx.deleteFrom("_charactersToconversations").where("A", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("_charactersToconversations")
                  .values(
                    itemsToAdd.map((item) => ({
                      A: item.id,
                      B: params.id,
                    })),
                  )
                  .execute();
              }
            }
          });
          return { message: `Conversation ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateConversationSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          const { title, project_id } = await db
            .deleteFrom("conversations")
            .where("conversations.id", "=", params.id)
            .returning(["conversations.title", "conversations.project_id"])
            .executeTakeFirstOrThrow();

          afterDeleteHandler({ title, project_id }, "conversations");

          return { message: `Character ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
