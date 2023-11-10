import Elysia from "elysia";

import { db } from "../database/db";
import { EntityListSchema, InsertTagSchema, UpdateTagSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";

export function tag_router(app: Elysia) {
  return app.group("/tags", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("tags").values(body.data).execute();
          return { message: `Tags ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertTagSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("tags")
            .where("project_id", "=", body.data.project_id)
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("tags", qb, body.filters);
              return qb;
            })
            .select(["id", "title", "color"])
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        { body: EntityListSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("tags").where("id", "=", params.id).set(body.data).execute();
          return { message: `Tag ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateTagSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("tags").where("id", "=", params.id).execute();
          return { message: `Tag ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
