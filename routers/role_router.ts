import Elysia from "elysia";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { InsertRoleSchema, ListRoleSchema, ReadRoleSchema, UpdateRoleSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { sendNotification } from "../utils/websocketUtils";

export function role_router(app: Elysia) {
  return app
    .decorate("permissions", {
      project_id: null,
      user_id: null,
    } as { project_id: string | null; user_id: string | null })
    .group("/roles", (server) =>
      server
        .post(
          "/create",
          async ({ body }) => {
            await db.transaction().execute(async (tx) => {
              const newRole = await tx
                .insertInto("roles")
                .values({ title: body.data.title, project_id: body.data.project_id, icon: body.data.icon })
                .returning("id")
                .executeTakeFirstOrThrow();

              return await tx
                .insertInto("role_permissions")
                .values(body.data.permissions.map((perm) => ({ role_id: newRole.id, permission_id: perm })))
                .execute();
            });

            return { message: `Role ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertRoleSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeProjectOwnerHandler(context),
          },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            const data = await db
              .selectFrom("roles")
              .where("id", "=", params.id)
              .select(["id", "title"])
              .$if(!!body.relations?.permissions, (qb) => {
                qb = qb.select([
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("role_permissions")
                        .whereRef("role_id", "=", "roles.id")
                        .leftJoin("permissions", "role_permissions.permission_id", "permissions.id")
                        .select(["permissions.id", "permissions.title", "permissions.code"]),
                    ).as("permissions"),
                ]);

                return qb;
              })
              .executeTakeFirst();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadRoleSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeProjectOwnerHandler(context),
          },
        )
        .post(
          "/",
          async ({ body }) => {
            const data = await db
              .selectFrom("roles")
              .where("project_id", "=", body.data.project_id)
              .select(["id", "title", "icon"])
              .$if(!!body.relations?.permissions, (qb) => {
                qb = qb.select([
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("role_permissions")
                        .whereRef("role_id", "=", "roles.id")
                        .leftJoin("permissions", "role_permissions.permission_id", "permissions.id")
                        .select(["permissions.id", "permissions.title", "permissions.code"]),
                    ).as("permissions"),
                ]);

                return qb;
              })
              .execute();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListRoleSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeProjectOwnerHandler(context),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            if (permissions.user_id && permissions.project_id) {
              await db.transaction().execute(async (tx) => {
                await tx
                  .updateTable("roles")
                  .where("id", "=", params.id)
                  .set({ title: body.data.title, icon: body.data.icon })

                  .executeTakeFirst();

                await tx.deleteFrom("role_permissions").where("role_id", "=", params.id).execute();
                if (body.data.permissions.length) {
                  await tx
                    .insertInto("role_permissions")
                    .values(body.data.permissions.map((perm) => ({ role_id: params.id, permission_id: perm })))
                    .execute();
                }
              });
              if (permissions)
                sendNotification(permissions.project_id as string, { entity_id: params.id, event_type: "ROLE_UPDATED" });
            }
            return { message: `Role ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          },
          {
            body: UpdateRoleSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeProjectOwnerHandler(context),
          },
        ),
    );
}
