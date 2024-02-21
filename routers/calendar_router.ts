import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import {
  InsertCalendarSchema,
  ListCalendarSchema,
  ReadCalendarSchema,
  UpdateCalendarSchema,
} from "../database/validation/calendars";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import {
  CreateTagRelations,
  GetEntityChildren,
  GetParents,
  GetRelationsForUpdating,
  TagQuery,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";

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
                .values(body.relations.months.map((month) => ({ ...month.data, parent_id: id })))
                .execute();
            if (body?.relations?.eras?.length)
              await tx
                .insertInto("eras")
                .values(body.relations.eras.map((era) => ({ ...era.data, parent_id: id })))
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
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("calendars", qb, body.filters);
              return qb;
            })
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
                      .where("months.parent_id", "=", params.id)
                      .orderBy("months.sort"),
                  ).as("months"),
                );
              }
              if (body.relations?.leap_days) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("leap_days")
                      .select(["leap_days.id", "leap_days.month_id", "leap_days.parent_id", "leap_days.conditions"])
                      .where("leap_days.parent_id", "=", params.id),
                  ).as("leap_days"),
                );
              }
              if (body.relations?.eras) {
                qb = qb.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("eras")
                      .select([
                        "eras.id",
                        "eras.title",
                        "eras.start_day",
                        "eras.start_month",
                        "eras.start_year",
                        "eras.start_month_id",
                        "eras.end_day",
                        "eras.end_month",
                        "eras.end_year",
                        "eras.end_month_id",
                        "eras.parent_id",
                        "eras.color",
                      ])
                      .orderBy("eras.start_year")
                      .where("eras.parent_id", "=", params.id),
                  ).as("eras"),
                );
              }
              if (body?.relations?.tags) {
                qb = qb.select((eb) => TagQuery(eb, "_calendarsTotags", "calendars"));
              }
              return qb;
            })
            .$if(!!body?.relations?.children, (qb) =>
              GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "calendars"),
            )
            .executeTakeFirstOrThrow();

          if (body?.relations?.parents) {
            const parents = await GetParents({ db, id: params.id, table_name: "calendars" });
            data.parents = parents;
            return { data, message: MessageEnum.success, ok: true };
          }

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
            if (body.relations.leap_days) {
              const existingLeapDays = await tx
                .selectFrom("leap_days")
                .where("leap_days.parent_id", "=", params.id)
                .select(["id"])
                .execute();
              const existingLeapDayIds = existingLeapDays.map((month) => month.id);

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingLeapDayIds,
                body.relations.leap_days.map((ld) => ld.data),
              );
              if (idsToRemove.length) {
                await tx.deleteFrom("leap_days").where("leap_days.id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("leap_days")
                  .values(
                    itemsToAdd.map((m) => ({ ...(m as any), conditions: JSON.stringify(m.conditions), parent_id: params.id })),
                  )
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    await tx
                      .updateTable("leap_days")
                      .where("parent_id", "=", params.id)
                      .where("id", "=", item.id)
                      .set(item)
                      .execute();
                  }),
                );
              }
            }

            if (body.relations.months) {
              const existingMonths = await tx
                .selectFrom("months")
                .where("months.parent_id", "=", params.id)
                .select(["id"])
                .execute();

              const existingMonthIds = existingMonths.map((month) => month.id);

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingMonthIds,
                body.relations.months.map((m) => m.data),
              );
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
                    await tx
                      .updateTable("months")
                      .where("parent_id", "=", params.id)
                      .where("months.id", "=", item.id)
                      .set(item)
                      .execute();
                  }),
                );
              }
            }

            if (body.relations.eras) {
              const existingEras = await tx.selectFrom("eras").where("eras.parent_id", "=", params.id).select(["id"]).execute();

              const existingEraIds = existingEras.map((era) => era.id);

              const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                existingEraIds,
                body.relations.eras.map((m) => m.data),
              );
              if (idsToRemove.length) {
                await tx.deleteFrom("eras").where("eras.id", "in", idsToRemove).execute();
              }
              if (itemsToAdd.length) {
                await tx
                  .insertInto("eras")
                  .values(itemsToAdd.map((m) => ({ ...(m as any), parent_id: params.id })))
                  .execute();
              }
              if (itemsToUpdate.length) {
                await Promise.all(
                  itemsToUpdate.map(async (item) => {
                    await tx
                      .updateTable("eras")
                      .where("parent_id", "=", params.id)
                      .where("eras.id", "=", item.id)
                      .set(item)
                      .execute();
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
      .delete(
        "/:id",
        async ({ params }) => {
          const data = await db
            .deleteFrom("calendars")
            .where("calendars.id", "=", params.id)
            .returning(["id", "title", "project_id"])
            .executeTakeFirstOrThrow();

          return { data, message: `Calendar ${MessageEnum.successfully_deleted}.`, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      ),
  );
}
