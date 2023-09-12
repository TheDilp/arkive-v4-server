import Elysia from "elysia";

import { db } from "../database/db";
import { EntityListSchema, InsertTagSchema, UpdateTagSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function tag_router(app: Elysia) {
  return app.group("/tags", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("tags").values(body).execute();
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
            .select(["id", "title", "color"])
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .where("project_id", "=", body.data.project_id)
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        { body: EntityListSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("tags").where("id", "=", params.id).set(body).execute();
          return { message: `Tag ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateTagSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/delete/:id",
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
