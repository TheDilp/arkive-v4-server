import Elysia from "elysia";

import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseWithDataSchema } from "../types/requestTypes";

export function permission_router(app: Elysia) {
  return app.group("/permissions", (server) =>
    server.post(
      "/",
      async () => {
        const data = await db.selectFrom("permissions").select(["id", "title", "code"]).execute();

        return { data, message: MessageEnum.success, ok: true, role_access: true };
      },
      {
        response: ResponseWithDataSchema,
      },
    ),
  );
}
