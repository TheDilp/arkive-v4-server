import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertConversationSchema, ListConversationSchema } from "../database/validation";
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
              constructFilter("characters", qb, body.filters),
            )
            .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ListConversationSchema, response: ResponseWithDataSchema },
      ),
  );
}
