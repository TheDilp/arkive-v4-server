import Elysia from "elysia";

import { db } from "../database/db";
import { DeleteManyEdgeSchema, InsertEdgeSchema, ReadEdgeSchema, UpdateEdgeSchema } from "../database/validation/edges";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function edge_router(app: Elysia) {
  return app.group("/edges", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          let returning;
          await db.transaction().execute(async (tx) => {
            const edge = await tx.insertInto("edges").values(body.data).returning("id").executeTakeFirstOrThrow();
            returning = edge;
            if (body.relations?.tags) {
              await CreateTagRelations({ relationalTable: "_edgesTotags", tags: body.relations.tags, id: edge.id, tx });
            }
          });

          return { data: returning, message: `Edge ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertEdgeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("edges")
            .selectAll()
            .where("edges.id", "=", params.id)
            .$if(!!body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_edgesTotags", "edges")))
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadEdgeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await tx.updateTable("edges").where("id", "=", params.id).set(body.data).executeTakeFirstOrThrow();
            }
            if (body?.relations) {
              if (body.relations?.tags)
                await UpdateTagRelations({
                  relationalTable: "_edgesTotags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                });
            }
          });

          return { message: `Edge ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateEdgeSchema,
          response: ResponseSchema,
        },
      )
      .delete(
        "/",
        async ({ body }) => {
          const edge_ids = body.data.map((edge) => edge.id);
          if (edge_ids.length) await db.deleteFrom("edges").where("id", "in", edge_ids).execute();

          return { message: `Edges ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          body: DeleteManyEdgeSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("edges").where("edges.id", "=", params.id).execute();
        return { message: `Edge ${MessageEnum.successfully_deleted}`, ok: true };
      })
      .delete(
        "/",
        async ({ body }) => {
          await db
            .deleteFrom("edges")
            .where(
              "edges.id",
              "=",
              body.data.map((i) => i.id),
            )
            .execute();
          return { message: `Edges ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          body: DeleteManyEdgeSchema,
          response: ResponseSchema,
        },
      ),
  );
}
