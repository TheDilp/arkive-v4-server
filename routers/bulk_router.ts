import Elysia, { t } from "elysia";

import { db } from "../database/db";
import { BulkDeleteEntitiesType } from "../types/entityTypes";

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
      },
      {
        body: t.Object({
          data: t.Object({
            ids: t.Array(t.String(), { minItems: 1, maxItems: 100 }),
          }),
        }),
      },
    ),
  );
}
