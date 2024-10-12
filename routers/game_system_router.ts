import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { PermissionDecorationType, RequestBodySchema, ResponseWithDataSchema } from "../types/requestTypes";

export function game_system_router(app: Elysia) {
  return app.group("/game_systems", (server) =>
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
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("game_systems")
            .select(body.fields as SelectExpression<DB, "game_systems">[])
            .execute();

          return { data, message: "Success", ok: true, role_access: true };
        },
        {
          body: RequestBodySchema,
          response: ResponseWithDataSchema,
        },
      ),
  );
}
