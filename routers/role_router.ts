import Elysia from "elysia";

import { db } from "../database/db";
import { InsertRoleSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function role_router(app: Elysia) {
  return app.group("/roles", (server) =>
    server.post(
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

        return { message: `Role ${MessageEnum.successfully_created}`, ok: true };
      },
      {
        body: InsertRoleSchema,
        response: ResponseSchema,
      },
    ),
  );
}
