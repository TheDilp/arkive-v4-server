import Elysia from "elysia";

import { InsertUserSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function user_router(app: Elysia) {
  return app.group("/users", (server) =>
    server.post(
      "/create",
      async () => {
        return { message: MessageEnum.success, ok: true };
      },
      {
        body: InsertUserSchema,
        response: ResponseSchema,
      },
    ),
  );
}
