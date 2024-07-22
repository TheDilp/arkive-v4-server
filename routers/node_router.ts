import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { getNestedReadPermission } from "../database/queries";
import {
  DeleteManyNodesSchema,
  InsertNodeSchema,
  ListNodesSchema,
  ReadNodeSchema,
  UpdateNodeSchema,
} from "../database/validation/nodes";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function node_router(app: Elysia) {
  return app.group("/nodes", (server) =>
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
        async ({ params, body, permissions }) => {
          let query = db.selectFrom("nodes").selectAll().where("nodes.id", "=", params.id);
          if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
            query = query.select((eb) =>
              TagQuery(eb, "_nodesTotags", "nodes", permissions.is_project_owner, permissions.user_id),
            );
          }
          if (body?.relations?.image && permissions.all_permissions?.read_assets) {
            query = query.select((eb) => {
              let image_query = eb
                .selectFrom("images")
                .whereRef("images.id", "=", "nodes.image_id")
                .select(["images.id", "images.title"]);

              image_query = getNestedReadPermission(
                image_query,
                permissions.is_project_owner,
                permissions.user_id,
                "nodes.image_id",
                "read_assets",
              );

              return jsonObjectFrom(image_query).as("image");
            });
          }
          if (body?.relations?.character && permissions.all_permissions?.read_characters) {
            query = query.select((eb) => {
              let character_query = eb
                .selectFrom("characters")
                .whereRef("characters.id", "=", "nodes.character_id")
                .select(["characters.id", "characters.first_name", "characters.last_name", "characters.portrait_id"]);

              character_query = getNestedReadPermission(
                character_query,
                permissions.is_project_owner,
                permissions.user_id,
                "nodes.character_id",
                "read_characters",
              );

              return jsonObjectFrom(character_query).as("character");
            });
          }
          if (body?.relations?.document && permissions.all_permissions?.read_documents) {
            query = query.select((eb) => {
              let document_query = eb
                .selectFrom("documents")
                .whereRef("documents.id", "=", "nodes.doc_id")
                .select(["documents.id", "documents.title", "documents.image_id"]);

              document_query = getNestedReadPermission(
                document_query,
                permissions.is_project_owner,
                permissions.user_id,
                "nodes.document_id",
                "read_documents",
              );

              return jsonObjectFrom(document_query).as("document");
            });
          }
          if (body?.relations?.map_pin) {
            query = query.select((eb) => {
              let map_pin_query = eb
                .selectFrom("map_pins")
                .whereRef("map_pins.id", "=", "nodes.map_pin_id")
                .select(["id", "title", "parent_id", "icon"]);
              return jsonObjectFrom(map_pin_query).as("map_pin");
            });
          }
          if (body?.relations?.event && permissions.all_permissions?.read_events) {
            query = query.select((eb) => {
              let event_query = eb
                .selectFrom("events")
                .whereRef("events.id", "=", "nodes.event_id")
                .select(["events.id", "events.title", "events.parent_id"]);
              event_query = getNestedReadPermission(
                event_query,
                permissions.is_project_owner,
                permissions.user_id,
                "nodes.event_id",
                "read_events",
              );
              return jsonObjectFrom(event_query).as("event");
            });
          }
          const data = await query.executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadNodeSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_graphs"),
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
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
                  is_project_owner: permissions.is_project_owner,
                });
            }
          });
          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: UpdateNodeSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_graphs"),
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
