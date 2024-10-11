import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { AddToGameSchema, ListGameSchema, ReadGameSchema, UpdateGamePermissionsSchema } from "../database/validation";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

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
        )
        .post(
          "/add/:type",
          async ({ params, body }) => {
            if (params.type === "character") {
              await db.insertInto("game_characters").values(body.data).execute();
            }

            return { role_access: true, message: "Success", ok: true };
          },
          {
            body: AddToGameSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/update/:type/permissions",
          async ({ params, body, permissions }) => {
            if (permissions?.game_id) {
              if (params.type === "character") {
                await db
                  .insertInto("game_character_permissions")

                  .values({ ...body.data, game_id: permissions.game_id })
                  .onConflict((cb) =>
                    cb.constraint("unique_game_player_character_permission").doUpdateSet({ permission: body.data.permission }),
                  )
                  .execute();
              } else {
                console.error(`UNSUPPORTED TYPE - ${params.type}`);

                return { role_access: true, message: "There was an error with your request.", ok: false };
              }
            }

            return { role_access: true, message: "Success", ok: true };
          },
          {
            body: UpdateGamePermissionsSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/remove/:type/:id",
          async ({ params, permissions }) => {
            if (permissions?.game_id) {
              if (params.type === "character") {
                await db
                  .deleteFrom("game_characters")
                  .where("game_characters.game_id", "=", permissions.game_id)
                  .where("game_characters.id", "=", params.id)
                  .execute();
              } else {
                console.error(`UNSUPPORTED TYPE - ${params.type}`);

                return { role_access: true, message: "There was an error with your request.", ok: false };
              }
            } else {
              console.error(`GAME ID NOT PRESENT - ${permissions.project_id}`);
            }

            return { role_access: true, message: "Success", ok: true };
          },
          {
            response: ResponseSchema,
          },
        ),
    );
}
