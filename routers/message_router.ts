import Elysia from "elysia";

import { db } from "../database/db";
import { InsertMessageSchema } from "../database/validation/messages";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function message_router(app: Elysia) {
  return app.group("/messages", (server) =>
    server.post(
      "/create",
      async ({ body }) => {
        await db.insertInto("messages").values(body.data).execute();
        return { message: MessageEnum.success, ok: true };
      },
      { body: InsertMessageSchema, response: ResponseSchema },
    ),
  );
}
