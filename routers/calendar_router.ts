import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { UpdateMonthSchema } from "../database/validation";
import {
  InsertCalendarSchema,
  ListCalendarSchema,
  ReadCalendarSchema,
  UpdateCalendarSchema,
} from "../database/validation/calendars";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function calendar_router(app: Elysia) {
  return app.group("/calendars", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const { id } = await tx.insertInto("calendars").values(body.data).returning("id").executeTakeFirstOrThrow();

            if (body?.relations?.months?.length)
              await tx
                .insertInto("months")
                .values(body.relations.months.map((month) => ({ ...month, parent_id: id })))
                .execute();

            if (body.relations?.tags?.length) {
              const { tags } = body.relations;
              await CreateTagRelations({ tx, relationalTable: "_calendarsTotags", id, tags });
            }
          });

          return { message: MessageEnum.success, ok: true };
        },
        {
          body: InsertCalendarSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("calendars")
            .where("calendars.project_id", "=", body?.data?.project_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "calendars">[]))
            .$if(!!body.relations?.tags, (qb) => {
              if (body?.relations?.tags) {
                return qb.select((eb) => TagQuery(eb, "_calendarsTotags", "calendars"));
              }
              return qb;
            })
            .execute();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListCalendarSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("calendars")
            .where("calendars.id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "calendars">[]))
            .$if(!!body?.relations, (qb) => {
              if (body.relations?.months) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("months")
                      .select(["months.id", "months.days", "months.sort", "months.title", "months.parent_id"])
                      .where("months.parent_id", "=", params.id),
                  ).as("months"),
                );
              }

              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_calendarsTotags", "calendars"));
              }
              return qb;
            })
            .executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadCalendarSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            await tx.updateTable("calendars").where("calendars.id", "=", params.id).set(body.data).execute();

            if (body.relations.months) {
              const existingMonths = await tx
                .selectFrom("months")
                .where("months.parent_id", "=", params.id)
                .select(["id"])
                .execute();

              const existingMonthIds = existingMonths.map((month) => month.id);

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(existingMonthIds, body.relations.months);
              if (idsToRemove.length) {
                await tx.deleteFrom("months").where("months.id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("months")
                  .values(itemsToAdd.map((m) => ({ ...(m as any), parent_id: params.id })))
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    const parsedMonth = UpdateMonthSchema.parse(item);
                    await tx.updateTable("months").where("parent_id", "=", params.id).set(parsedMonth).execute();
                  }),
                );
              }
            }
            if (body?.relations?.tags) {
              await UpdateTagRelations({
                relationalTable: "_calendarsTotags",
                id: params.id,
                newTags: body.relations.tags,
                tx,
              });
            }
          });
          return { message: MessageEnum.success, ok: true };
        },
        { body: UpdateCalendarSchema, response: ResponseSchema },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("calendars").where("calendars.id", "=", params.id).execute();
        return { message: `Calendar ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
