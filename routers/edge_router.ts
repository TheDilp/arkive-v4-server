import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  DeleteManyEdgeSchema,
  InsertEdgeSchema,
  ListEdgesSchema,
  ReadEdgeSchema,
  UpdateEdgeSchema,
  UpdateManyEdgesSchema,
} from "../database/validation/edges";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
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
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("edges")
            .where("parent_id", "=", body.data.parent_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "edges">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("edges", qb, body.filters);
              return qb;
            })
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ListEdgesSchema,
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
      .post(
        "/update",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await Promise.all(
                body.data.map((n) => {
                  return tx
                    .updateTable("edges")
                    .where("id", "=", n.data.id as string)
                    .set(n.data)
                    .execute();
                }),
              );
            }
          });
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: UpdateManyEdgesSchema,
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
