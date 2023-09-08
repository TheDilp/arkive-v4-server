import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertEventSchema, InsertEventType } from "../database/validation";

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

  done();
}
