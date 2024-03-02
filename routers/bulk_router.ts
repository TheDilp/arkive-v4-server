import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import Elysia, { t } from "elysia";

import { db } from "../database/db";
import {
  InsertNodeSchema,
  InsertRandomTableOptionSchema,
  UpdateEdgeSchema,
  UpdateEventSchema,
  UpdateNodeSchema,
} from "../database/validation";
import { BulkDeleteEntities } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { AvailableEntityType, AvailableSubEntityType, BulkDeleteEntitiesType, PublicEntities } from "../types/entityTypes";
import { ResponseSchema } from "../types/requestTypes";
import { UpdateTagRelations } from "../utils/relationalQueryHelpers";
import { getEntityTagTable } from "../utils/requestUtils";
import { s3Client } from "../utils/s3Utils";

export function bulk_router(app: Elysia) {
  return app.group("/bulk", (server) =>
    server
      .post(
        "/create/:type",
        async ({ params, body }) => {
          db.insertInto(params.type as AvailableEntityType | AvailableSubEntityType)
            .values(body.data.map((item) => item.data))
            .execute();

          return { ok: true, message: `Nodes ${MessageEnum.successfully_created}` };
        },
        {
          body: t.Object({ data: t.Array(t.Union([InsertNodeSchema, InsertRandomTableOptionSchema])) }),
          response: ResponseSchema,
        },
      )
      .post(
        "/update/public/:type",
        async ({ params, body }) => {
          await db
            .updateTable(params.type as PublicEntities)
            .set({ is_public: body.data.is_public })
            .where("id", "in", body.data.ids)
            .execute();

          return { message: MessageEnum.success, ok: true };
        },
        {
          body: t.Object({ data: t.Object({ ids: t.Array(t.String()), is_public: t.Boolean() }) }),
          response: ResponseSchema,
        },
      )
      .post(
        "/update/:type",
        async ({ params, body }) => {
          db.transaction().execute(async (tx) => {
            await Promise.all(
              body.data.map((item) =>
                tx
                  .updateTable(params.type as AvailableEntityType | AvailableSubEntityType)
                  .set(item.data)
                  .where("id", "=", item.data.id)
                  .execute(),
              ),
            );

            if (params.type === "nodes") {
              const nodesWithTagsToUpdate = body.data.filter((n) => !!n?.relations?.tags);
              if (nodesWithTagsToUpdate.length)
                await Promise.all(
                  nodesWithTagsToUpdate.map((n) =>
                    UpdateTagRelations({
                      relationalTable: "_nodesTotags",
                      id: n.data.id,
                      newTags: n.relations?.tags as { id: string }[],
                      tx,
                    }),
                  ),
                );
            } else if (params.type === "edges") {
              const edgesWithTagsToUpdate = body.data.filter((n) => !!n?.relations?.tags);
              if (edgesWithTagsToUpdate.length)
                await Promise.all(
                  edgesWithTagsToUpdate.map((e) =>
                    UpdateTagRelations({
                      relationalTable: "_edgesTotags",
                      id: e.data.id,
                      newTags: e.relations?.tags as { id: string }[],
                      tx,
                    }),
                  ),
                );
            }
          });
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: t.Object({ data: t.Array(t.Union([UpdateEventSchema, UpdateNodeSchema, UpdateEdgeSchema])) }),
          response: ResponseSchema,
        },
      )
      .post(
        "/tags/:type",
        async ({ params, body }) => {
          const entityTagTable = getEntityTagTable(params.type as AvailableEntityType | AvailableSubEntityType);
          if (entityTagTable) {
            await db.transaction().execute(async (tx) => {
              if (body.data.add.length) await tx.insertInto(entityTagTable).values(body.data.add).execute();
              if (body.data.remove.length)
                await tx
                  .deleteFrom(entityTagTable)
                  .where((eb) => eb.or(body.data.remove.map((r) => eb.and([eb("A", "=", r.A), eb("B", "=", r.B)]))))
                  .execute();
            });
          }
          return { ok: true, message: MessageEnum.success };
        },
        {
          body: t.Object({
            data: t.Object({
              add: t.Array(t.Object({ A: t.String(), B: t.String() })),
              remove: t.Array(t.Object({ A: t.String(), B: t.String() })),
            }),
          }),
          response: ResponseSchema,
        },
      )
      .delete(
        "/delete/:type",
        async ({ params, body }) => {
          if (params.type) {
            if (!BulkDeleteEntities.includes(params.type)) {
              console.error("ATTEMPTED BULK DELETE WITH UNALLOWED TYPE", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && !body.data.project_id) {
              console.error("ATTEMPTED BULK DELETE FOR IMAGES WITH NO PROJECT ID", params.type);
              throw new Error("INTERNAL_SERVER_ERROR");
            }
            if (params.type === "images" && body.data.project_id) {
              try {
                const filePath = `assets/${body.data.project_id}/${params.type}`;
                const deleteCommand = new DeleteObjectsCommand({
                  Bucket: process.env.DO_SPACES_NAME as string,
                  Delete: {
                    Objects: (body.data.ids || []).map((id) => ({ Key: `${filePath}/${id}.webp` })),
                    Quiet: false,
                  },
                });
                await s3Client.send(deleteCommand);
                await db
                  .deleteFrom(params.type as BulkDeleteEntitiesType)
                  .where("id", "in", body.data.ids)
                  .execute();
              } catch (error) {
                console.error("ERROR BULK DELETING S3 IMAGES ");
                throw new Error("INTERNAL_SERVER_ERROR");
              }
            }
          }
          return { message: `Many ${params.type.replaceAll("_", " ")} ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          body: t.Object({
            data: t.Object({
              ids: t.Array(t.String(), { minItems: 1, maxItems: 100 }),
              project_id: t.Optional(t.String()),
            }),
          }),
          response: ResponseSchema,
        },
      ),
  );
}
