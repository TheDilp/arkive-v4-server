import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  DeleteManyEdgeSchema,
  InsertEdgeSchema,
  ListEdgesSchema,
  ReadEdgeSchema,
  UpdateEdgeSchema,
} from "../database/validation/edges";
import { MessageEnum } from "../enums/requestEnums";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { CreateTagRelations, TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function edge_router(app: Elysia) {
  return app.group("/edges", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
        all_permissions: {},
      } as PermissionDecorationType)
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

          return { data: returning, message: `Edge ${MessageEnum.successfully_created}`, ok: true, role_access: true };
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
            .select(body.fields as SelectExpression<DB, "edges">[])
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("edges", qb, body.filters);
              return qb;
            })
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListEdgesSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body, permissions }) => {
          const data = await db
            .selectFrom("edges")
            .selectAll()
            .where("edges.id", "=", params.id)
            .$if(!!body?.relations?.tags && !!permissions?.all_permissions?.read_tags, (qb) =>
              qb.select((eb) => TagQuery(eb, "_edgesTotags", "edges", permissions.is_project_owner, permissions.user_id)),
            )
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadEdgeSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
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
                  is_project_owner: permissions.is_project_owner,
                });
            }
          });

          return { message: `Edge ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
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

          return { message: `Edges ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
        },
        {
          body: DeleteManyEdgeSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("edges").where("edges.id", "=", params.id).execute();
        return { message: `Edge ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
      }),
  );
}
