import Elysia from "elysia";

import { db } from "../database/db";
import { InsertUserSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function user_router(app: Elysia) {
  return app.group("/users", (server) =>
    server
      .post(
        "/create",
        async () => {
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: InsertUserSchema,
          response: ResponseSchema,
        },
      )
      .get(
        "/:id",
        async ({ params }) => {
          const data = await db.selectFrom("users").where("id", "=", params.id).executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
