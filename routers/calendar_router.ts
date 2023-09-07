import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertCalendarSchema, InsertCalendarType } from "../database/validation/calendars";
import { InsertMonthType, UpdateMonthType } from "../database/validation/months";
import { RequestBodyType } from "../types/requestTypes";

export function calendar_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: { data: InsertCalendarType; relations: { months: (InsertMonthType | UpdateMonthType)[]; days: string[] } };
      }>,
      rep,
    ) => {
      const parsedData = InsertCalendarSchema.parse({ data: req.body.data, relations: req.body.relations });
      await db.transaction().execute(async (tx) => {
        const { id } = await tx.insertInto("calendars").values(parsedData.data).returning("id").executeTakeFirstOrThrow();

        for (let index = 0; index < parsedData.relations.months.length; index++) {
          await tx
            .insertInto("months")
            .values({ ...parsedData.relations.months[index], parent_id: id })
            .execute();
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
      .$if(!!req.body?.relations?.months, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("months")
              .select(["months.id", "months.days", "months.sort", "months.title"])
              .where("months.parent_id", "=", req.params.id),
          ).as("months"),
        ),
      )
      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success.", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  // #endregion delete_routes

  done();
}
