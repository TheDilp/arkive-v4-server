import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertTimelineSchema, InsertTimelineType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";

export function timeline_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertTimelineType; relations: { calendars: { id: string }[] } } }>, rep) => {
      const parsedData = InsertTimelineSchema.parse(req.body);

      await db.transaction().execute(async (tx) => {
        const { id } = await tx.insertInto("timelines").values(parsedData.data).returning("id").executeTakeFirstOrThrow();
        const calendarIds = req.body.relations.calendars.map((cal) => cal.id);
        await tx
          .insertInto("_calendarsTotimelines")
          .values(calendarIds.map((calId) => ({ A: calId, B: id })))
          .execute();
      });
      rep.send({ message: "Success", ok: true });
    },
  );
  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("timelines")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "timelines">[]))
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("timelines")
      .select(["id", "title"])
      .$if(!!req.body?.relations?.events, (qb) =>
        qb
          .leftJoin("_calendarsTotimelines", "B", "timelines.id")
          .select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("events")
                .select([
                  "events.id",
                  "events.title",
                  "events.background_color",
                  "events.parent_id",
                  "events.start_day",
                  "events.start_month",
                  "events.start_year",
                  "events.end_day",
                  "events.end_month",
                  "events.end_year",
                  "events.image_id",
                ])
                .whereRef("events.parent_id", "=", "A"),
            ).as("events"),
          ),
      )
      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  // #endregion delete_routes

  done();
}
