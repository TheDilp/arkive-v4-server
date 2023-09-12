import { Elysia } from "elysia";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { ListCharacterFieldsSchema } from "../database/validation";
import { ResponseWithDataSchema } from "../types/requestTypes";

export function character_fields_router(app: Elysia) {
  return app.group("/character_fields", (server) =>
    server.post(
      "/",
      async ({ body }) => {
        const character_fields = await db
          .selectFrom("character_fields")
          .select([
            "id",
            "title",
            "project_id",
            "sort",
            "field_type",
            "parent_id",
            "options",
            "formula",
            "random_table_id",
            (eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("random_tables")
                  .select(["id", "title"])
                  .whereRef("random_tables.id", "=", "character_fields.random_table_id"),
              ).as("random_table"),
          ])

          .where("character_fields.parent_id", "=", body.data.parent_id)
          .execute();

        return { data: character_fields, message: "Success.", ok: true };
      },
      {
        body: ListCharacterFieldsSchema,
        response: ResponseWithDataSchema,
      },
    ),
  );
}
