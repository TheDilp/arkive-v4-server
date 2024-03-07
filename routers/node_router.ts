import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  DeleteManyNodesSchema,
  InsertNodeSchema,
  ListNodesSchema,
  ReadNodeSchema,
  UpdateNodeSchema,
} from "../database/validation/nodes";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function node_router(app: Elysia) {
  return app.group("/nodes", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          const returningData = await db.insertInto("nodes").values(body.data).returning("id").executeTakeFirstOrThrow();

          return { data: returningData, message: `Node ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertNodeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("nodes")
            .where("parent_id", "=", body.data.parent_id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "nodes">[]))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("nodes", qb, body.filters);
              return qb;
            })
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListNodesSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("nodes")
            .selectAll()
            .where("nodes.id", "=", params.id)
            .$if(!!body?.relations?.tags, (qb) => qb.select((eb) => TagQuery(eb, "_nodesTotags", "nodes")))
            .$if(!!body?.relations?.image, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(eb.selectFrom("images").whereRef("images.id", "=", "nodes.image_id").select(["id", "title"])).as(
                  "image",
                ),
              ),
            )
            .$if(!!body?.relations?.character, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("characters")
                    .whereRef("characters.id", "=", "nodes.character_id")
                    .select(["id", "first_name", "last_name", "portrait_id"]),
                ).as("character"),
              ),
            )
            .$if(!!body?.relations?.document, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb.selectFrom("documents").whereRef("documents.id", "=", "nodes.doc_id").select(["id", "title", "image_id"]),
                ).as("document"),
              ),
            )
            .$if(!!body?.relations?.map_pin, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("map_pins")
                    .whereRef("map_pins.id", "=", "nodes.map_pin_id")
                    .select(["id", "title", "parent_id", "icon"]),
                ).as("map_pin"),
              ),
            )
            .$if(!!body?.relations?.event, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb.selectFrom("events").whereRef("events.id", "=", "nodes.event_id").select(["id", "title", "parent_id"]),
                ).as("event"),
              ),
            )
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadNodeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await tx.updateTable("nodes").set(body.data).where("nodes.id", "=", params.id).executeTakeFirstOrThrow();
            }
            if (body?.relations) {
              if (body.relations?.tags)
                await UpdateTagRelations({
                  relationalTable: "_nodesTotags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                });
            }
          });
          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        { body: UpdateNodeSchema, response: ResponseSchema },
      )

      .delete(
        "/:id",
        async ({ params }) => {
          await db
            .deleteFrom("edges")
            .where((eb) => eb.or([eb("source_id", "=", params.id), eb("target_id", "=", params.id)]))
            .execute();
          await db.deleteFrom("nodes").where("nodes.id", "=", params.id).execute();
          return { message: `Node ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
        },
      )
      .delete(
        "/",
        async ({ body }) => {
          const node_ids = body.data.map((n) => n.id);

          if (node_ids.length) {
            await db
              .deleteFrom("edges")
              .where((eb) => eb.or([eb("source_id", "in", node_ids), eb("target_id", "in", node_ids)]))
              .execute();
            await db.deleteFrom("nodes").where("id", "in", node_ids).execute();
          }

          return { message: `Nodes ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          body: DeleteManyNodesSchema,
          response: ResponseSchema,
        },
      ),
  );
}
