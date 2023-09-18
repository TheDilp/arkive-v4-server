import Elysia from "elysia";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import {
  DeleteManyNodesSchema,
  InsertNodeSchema,
  ReadNodeSchema,
  UpdateManyNodesSchema,
  UpdateNodeSchema,
} from "../database/validation/nodes";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function node_router(app: Elysia) {
  return app.group("/nodes", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          const returningData = await db.insertInto("nodes").values(body.data).returning("id").executeTakeFirstOrThrow();

          return { data: returningData, message: `Node ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertNodeSchema,
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
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
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
              await tx
                .updateTable("nodes")
                .set(body.data)
                .where("nodes.id", "=", params.id)

                .executeTakeFirstOrThrow();
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
          return { message: MessageEnum.success, ok: true };
        },
        { body: UpdateNodeSchema, response: ResponseSchema },
      )
      .post(
        "/update",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            if (body.data) {
              await Promise.all(
                body.data.map((n) => {
                  return tx
                    .updateTable("nodes")
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
          body: UpdateManyNodesSchema,
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db
            .deleteFrom("edges")
            .where((eb) => eb.or([eb("source_id", "=", params.id), eb("target_id", "=", params.id)]))
            .execute();
          await db.deleteFrom("nodes").where("nodes.id", "=", params.id).execute();
          return { message: `Node ${MessageEnum.successfully_deleted}`, ok: true };
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

          return { message: `Nodes ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          body: DeleteManyNodesSchema,
          response: ResponseSchema,
        },
      ),
  );
}
