import Elysia, { t } from "elysia";

import { db } from "../database/db";
import { BulkDeleteEntities } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { BulkDeleteEntitiesType, PublicEntities } from "../types/entityTypes";
import { ResponseSchema } from "../types/requestTypes";

export function bulk_router(app: Elysia) {
  return app.group("/bulk", (server) =>
    server
      .post(
        "/update/:type",
        async ({ params, body }) => {
          await db
            .updateTable(params.type as PublicEntities)
            .set({ is_public: body.data.is_public })
            .where("id", "in", body.data.ids)
            .execute();

          return { message: MessageEnum.success, ok: true };
        },
        {
          body: t.Object({ data: t.Object({ ids: t.Array(t.String()), is_public: t.Boolean() }) }),
          response: ResponseSchema,
        },
      )
      .delete(
        "/delete/:type",
        async ({ params, body }) => {
          if (params.type) {
            if (!BulkDeleteEntities.includes(params.type)) {
              console.error("ATTEMPTED BULK DELETE WITH UNALLOWED TYPE");
              throw new Error("INTERNAL_SERVER_ERROR");
            }
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
