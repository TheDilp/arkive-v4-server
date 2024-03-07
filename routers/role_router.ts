import Elysia from "elysia";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { InsertRoleSchema, ListRoleSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function role_router(app: Elysia) {
  return app.group("/roles", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.transaction().execute(async (tx) => {
            const newRole = await tx
              .insertInto("roles")
              .values({ title: body.data.title, project_id: body.data.project_id })
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
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("roles")
            .where("project_id", "=", body.data.project_id)
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
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListRoleSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
        },
      ),
  );
}
