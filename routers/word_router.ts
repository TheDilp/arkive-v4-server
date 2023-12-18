import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InserWordSchema, ListWordSchema, ReadWordSchema, UpdateWordSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";

export function word_router(app: Elysia) {
  return app.group("/words", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("words").values(body.data).execute();
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
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("words", qb, body.filters);
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
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("words")
            .where("id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "words">[]))
            .executeTakeFirstOrThrow();
          return { data, ok: true, message: MessageEnum.success };
        },
        {
          body: ReadWordSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("words").where("words.id", "=", params.id).set(body.data).execute();
          return { message: `Word ${MessageEnum.successfully_updated}`, ok: true };
        },
        { body: UpdateWordSchema, response: ResponseSchema },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          const res = await db
            .deleteFrom("words")
            .where("words.id", "=", params.id)
            .returning(["words.parent_id", "words.title"])
            .executeTakeFirstOrThrow();

          const data = await db
            .selectFrom("dictionaries")
            .where("id", "=", res.parent_id)
            .select(["project_id"])
            .executeTakeFirstOrThrow();

          return { data, message: `Word ${MessageEnum.successfully_deleted}.`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
