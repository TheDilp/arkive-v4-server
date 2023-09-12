import Elysia, { t } from "elysia";

import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function month_router(app: Elysia) {
  return app.group("/months", (server) =>
    server.post(
      "/",
      async ({ body }) => {
        const data = await db.selectFrom("months").where("months.parent_id", "=", body.data?.parent_id).selectAll().execute();

        return { data, message: MessageEnum.success, ok: true };
      },
      {
        body: t.Object({ data: t.Object({ parent_id: t.String() }) }),
        response: ResponseSchema,
      },
    ),
  );
}
