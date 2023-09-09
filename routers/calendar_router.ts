import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertMonthSchema, UpdateMonthSchema } from "../database/validation";
import {
  InsertCalendarSchema,
  InsertCalendarType,
  UpdateCalendarSchema,
  UpdateCalendarType,
} from "../database/validation/calendars";
import { RequestBodyType } from "../types/requestTypes";
import { CreateTagRelations, GetRelationsForUpdating, TagQuery } from "../utils/relationalQueryHelpers";

export function calendar_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: InsertCalendarType;
      }>,
      rep,
    ) => {
      const parsedData = InsertCalendarSchema.parse({ data: req.body.data, relations: req.body.relations });
      await db.transaction().execute(async (tx) => {
        const { id } = await tx.insertInto("calendars").values(parsedData.data).returning("id").executeTakeFirstOrThrow();

        if (parsedData.relations.months.length)
          await tx
            .insertInto("months")
            .values(parsedData.relations.months.map((month) => ({ ...month, parent_id: id })))
            .execute();

        if (parsedData.relations?.tags?.length) {
          const { tags } = parsedData.relations;
          await CreateTagRelations({ tx, relationalTable: "_calendarsTotags", id, tags });
        }
      });

      rep.send({ message: "Success", ok: true });
    },
  );
  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("calendars")
      .where("calendars.project_id", "=", req.body?.data?.project_id)
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "calendars">[]))
      .execute();

    rep.send({ data, message: "Success.", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("calendars")
      .where("calendars.id", "=", req.params.id)
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "calendars">[]))
      .$if(!!req.body?.relations, (qb) => {
        if (req.body.relations?.months) {
          qb = qb.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("months")
                .select(["months.id", "months.days", "months.sort", "months.title", "months.parent_id"])
                .where("months.parent_id", "=", req.params.id),
            ).as("months"),
          );
        }
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_calendarsTotags", "calendars"));
        }
        return qb;
      })

      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: UpdateCalendarType;
      }>,
      rep,
    ) => {
      const parsedData = UpdateCalendarSchema.parse(req.body);
      await db.transaction().execute(async (tx) => {
        await tx.updateTable("calendars").where("calendars.id", "=", req.params.id).set(parsedData.data).execute();

        if (req.body.relations.months) {
          const existingMonths = await tx
            .selectFrom("months")
            .where("months.parent_id", "=", req.params.id)
            .select(["id"])
            .execute();

          const existingMonthIds = existingMonths.map((month) => month.id);

          const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
            existingMonthIds,
            parsedData.relations.months,
          );
          if (idsToRemove.length) {
            await tx.deleteFrom("months").where("months.id", "in", idsToRemove).execute();
          }
          if (itemsToAdd.length) {
            const parsedMonths = InsertMonthSchema.array().parse(itemsToAdd);
            await tx
              .insertInto("months")
              .values(parsedMonths.map((m) => ({ ...m, parent_id: req.params.id })))
              .execute();
          }
          if (itemsToUpdate.length) {
            await Promise.all(
              itemsToUpdate.map(async (item) => {
                const parsedMonth = UpdateMonthSchema.parse(item);
                await tx.updateTable("months").where("parent_id", "=", req.params.id).set(parsedMonth).execute();
              }),
            );
          }
        }
      });
      rep.send({ message: "Success", ok: true });
    },
  );
  // #endregion update_routes
  // #region delete_routes
  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep,
    ) => {
      await db.deleteFrom("calendars").where("calendars.id", "=", req.params.id).execute();
      rep.send({ message: "Calendar successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
