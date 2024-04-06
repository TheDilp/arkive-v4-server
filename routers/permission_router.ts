import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { RequestBodySchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function permission_router(app: Elysia) {
  return app.group("/permissions", (server) =>
    server.post(
      "/",
      async ({ body }) => {
        let query = db.selectFrom("permissions").select(body.fields as SelectExpression<DB, "permissions">[]);

        if (body.orderBy) {
          query = constructOrdering(body.orderBy, query);
        }
        const data = await query.execute();

        return { data, message: MessageEnum.success, ok: true, role_access: true };
      },
      {
        body: RequestBodySchema,
        response: ResponseWithDataSchema,
      },
    ),
  );
}
