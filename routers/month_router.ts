import Elysia from "elysia";

import { db } from "../database/db";
import { ListMonthSchema } from "../database/validation/months";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseWithDataSchema } from "../types/requestTypes";

export function month_router(app: Elysia) {
  return app.group("/months", (server) =>
    server.post(
      "/",
      async ({ body }) => {
        const data = await db.selectFrom("months").where("months.parent_id", "=", body.data.parent_id).selectAll().execute();

        return { data, message: MessageEnum.success, ok: true, role_access: true };
      },
      {
        body: ListMonthSchema,
        response: ResponseWithDataSchema,
      },
    ),
  );
}
