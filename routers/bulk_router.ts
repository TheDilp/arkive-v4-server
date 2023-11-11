import Elysia, { t } from "elysia";

import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { BulkDeleteEntitiesType } from "../types/entityTypes";
import { ResponseSchema } from "../types/requestTypes";

export function bulk_router(app: Elysia) {
  return app.group("/bulk", (server) =>
    server.delete(
      "/delete/:type",
      async ({ params, body }) => {
        if (params.type) {
          await db
            .deleteFrom(params.type as BulkDeleteEntitiesType)
            .where("id", "in", body.data.ids)
            .execute();
        }
        return { message: `Many ${params.type.replaceAll("_", " ")} ${MessageEnum.successfully_deleted}`, ok: true };
      },
      {
        body: t.Object({
          data: t.Object({
            ids: t.Array(t.String(), { minItems: 1, maxItems: 100 }),
          }),
        }),
        response: ResponseSchema,
      },
    ),
  );
}
