import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertEventSchema, InsertEventType, UpdateEventSchema, UpdateEventType } from "../database/validation";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function event_router(server: FastifyInstance, _: any, done: any) {
  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertEventType; relations?: { tags?: { id: string }[] } } }>, rep) => {
      const parsedData = InsertEventSchema.parse(req.body);

      if (parsedData) {
        await db.transaction().execute(async (tx) => {
          const { id } = await tx.insertInto("events").values(parsedData.data).returning(["id"]).executeTakeFirstOrThrow();

          if (parsedData?.relations?.tags?.length) {
            const { tags } = parsedData.relations;
            await tx
              .insertInto("_eventsTotags")
              .values(tags.map((tag) => ({ A: id, B: tag.id })))
              .execute();
          }
        });
      }
      rep.send({ message: "Success.", ok: true });
    },
  );
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("events")

      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "events">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("events", qb, req.body.filters);
        return qb;
      })
      .$if(!!req.body.orderBy?.length, (qb) => {
        qb = constructOrdering(req.body.orderBy, qb);
        return qb;
      })
      .execute();

    rep.send({ data, message: "Success.", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("events")
      .where("events.id", "=", req.params.id)
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "events">[]))
      .$if(!!req.body?.relations, (qb) => {
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_eventsTotags", "events"));
        }
        return qb;
      })
      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success.", ok: true });
  });
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateEventType; relations?: { tags?: { id: string }[] } } }>,
      rep,
    ) => {
      const parsedData = UpdateEventSchema.parse(req.body);
      if (parsedData) {
        await db.transaction().execute(async (tx) => {
          await tx.updateTable("events").where("id", "=", req.params.id).set(parsedData.data).execute();
          if (parsedData?.relations?.tags?.length) {
            UpdateTagRelations({
              relationalTable: "_eventsTotags",
              id: req.params.id,
              newTags: parsedData.relations?.tags,
              tx,
            });
          } else await tx.deleteFrom("_eventsTotags").where("A", "=", req.params.id).execute();
        });
      }
      rep.send({ message: "Success.", ok: true });
    },
  );

  done();
}
