import Elysia from "elysia";

import { db } from "../database/db";
import { InsertAlterNamesSchema } from "../database/validation/alter_names";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function alter_name_router(app: Elysia) {
  app.group("/alter_names", (server) =>
    server.post(
      "/create",
      async ({ body }) => {
        const data = await db.insertInto("alter_names").values(body.data).returning("id").executeTakeFirstOrThrow();

        return { data, message: MessageEnum.success, ok: true };
      },
      {
        body: InsertAlterNamesSchema,
        response: ResponseSchema,
      },
    ),
  );
}
