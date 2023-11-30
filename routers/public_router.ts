import Elysia from "elysia";

import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseWithDataSchema } from "../types/requestTypes";

export function public_router(app: Elysia) {
  return app.group("/public", (server) => {
    return server.get(
      "/project/:id",
      async ({ params }) => {
        const data = await db
          .selectFrom("projects")
          .where("id", "=", params.id)
          .select(["id", "title"])
          .executeTakeFirstOrThrow();
        return { data, message: MessageEnum.success, ok: true };
      },
      {
        response: ResponseWithDataSchema,
      },
    );
  });
}
