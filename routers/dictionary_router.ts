import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import { EntityListSchema } from "../database/validation";
import { InsertDictionarySchema, ReadDictionarySchema, UpdateDictionarySchema } from "../database/validation/dictionaries";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetBreadcrumbs, GetEntityChildren } from "../utils/relationalQueryHelpers";

export function dictionary_router(app: Elysia) {
  return app.group("/dictionaries", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("dictionaries").values(body.data).execute();
          return { ok: true, message: `Dictionary ${MessageEnum.successfully_created}` };
        },
        { body: InsertDictionarySchema, response: ResponseSchema },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("dictionaries")
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "dictionaries">[]))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .where("project_id", "=", body.data.project_id)
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: EntityListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("dictionaries")
            .where("id", "=", params.id)
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "dictionaries"),
            )
            .select([
              "dictionaries.id",
              "dictionaries.title",
              "dictionaries.icon",
              (eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("words")
                    .select(["words.id", "words.title", "words.description", "words.translation"])
                    .where("words.parent_id", "=", params.id),
                ).as("words"),
            ])

            .executeTakeFirstOrThrow();
          if (body?.relations?.parents) {
            const parents = await GetBreadcrumbs({ db, id: params.id, table_name: "dictionaries" });
            return { data: { ...data, parents }, message: MessageEnum.success, ok: true };
          }
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDictionarySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("dictionaries").where("id", "=", params.id).set(body.data).execute();
          return { message: MessageEnum.success, ok: true };
        },
        { body: UpdateDictionarySchema, response: ResponseSchema },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("dictionaries").where("id", "=", params.id).execute();
        return { ok: true, message: `Dictionary ${MessageEnum.successfully_deleted}` };
      }),
  );
}
