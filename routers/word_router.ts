import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InserWordSchema, ListWordSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

export function word_router(app: Elysia) {
  return app.group("/words", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("words").values(body).execute();
          return { ok: true, message: `Word ${MessageEnum.successfully_created}` };
        },
        {
          body: InserWordSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("words")
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "words">[]))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .where("parent_id", "=", body.data.parent_id)
            .execute();
          return { data, ok: true, message: MessageEnum.success };
        },
        {
          body: ListWordSchema,
          response: ResponseWithDataSchema,
        },
      )

      .delete(
        "/delete/:id",
        async ({ params }) => {
          await db.deleteFrom("words").where("id", "=", params.id).execute();
          return { ok: true, message: MessageEnum.success };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
