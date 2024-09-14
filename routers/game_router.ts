import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { ListGameSchema, ReadGameSchema } from "../database/validation";
import { PermissionDecorationType, ResponseWithDataSchema } from "../types/requestTypes";

export function game_router(app: Elysia) {
  return app
    .decorate("permissions", {
      user_id: "",
      project_id: null,
      is_project_owner: false,
      role_access: false,
      role_id: null,
      permission_id: null,
      all_permissions: {},
    } as PermissionDecorationType)
    .group("/games", (server) =>
      server
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("games")
              .where("owner_id", "=", permissions.user_id)
              .select(body.fields as SelectExpression<DB, "games">[])
              .execute();
            return { data, message: "Success", ok: true, role_access: true };
          },
          {
            body: ListGameSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            let query = db
              .selectFrom("games")
              .where("games.id", "=", params.id)
              .select(body.fields.map((f) => `games.${f}`) as SelectExpression<DB, "games">[]);

            if (body.relations?.game_players) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("game_players")
                    .select(["game_players.id", "game_players.nickname"])
                    .where("game_players.game_id", "=", params.id),
                ).as("game_players"),
              );
            }
            if (body.relations?.project) {
              query = query.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("projects")
                    .select(["projects.id", "projects.title", "projects.owner_id"])
                    .whereRef("projects.id", "=", "games.project_id"),
                ).as("project"),
              );
            }

            const data = await query.executeTakeFirst();

            return { data, role_access: true, message: "Success", ok: true };
          },
          {
            body: ReadGameSchema,
            response: ResponseWithDataSchema,
          },
        ),
    );
}
