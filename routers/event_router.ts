import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntityListSchema, InsertEventSchema, ReadEventSchema, UpdateEventSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function event_router(app: Elysia) {
  return app.group("/events", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          if (body) {
            await db.transaction().execute(async (tx) => {
              const { id } = await tx.insertInto("events").values(body.data).returning(["id"]).executeTakeFirstOrThrow();

              if (body?.relations?.tags?.length) {
                const { tags } = body.relations;
                await tx
                  .insertInto("_eventsTotags")
                  .values(tags.map((tag) => ({ A: id, B: tag.id })))
                  .execute();
              }
            });
          }
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: InsertEventSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("events")

            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("events", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
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
            .selectFrom("events")
            .where("events.id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "events">[]))
            .$if(!!body?.relations, (qb) => {
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_eventsTotags", "events"));
              }
              return qb;
            })
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadEventSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          if (body) {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("events").where("id", "=", params.id).set(body.data).execute();
              if (body?.relations?.tags?.length) {
                UpdateTagRelations({
                  relationalTable: "_eventsTotags",
                  id: params.id,
                  newTags: body.relations?.tags,
                  tx,
                });
              } else await tx.deleteFrom("_eventsTotags").where("A", "=", params.id).execute();
            });
          }
          return { message: `Event ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateEventSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("events").where("id", "=", params.id).execute();
          return { message: `Event ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
