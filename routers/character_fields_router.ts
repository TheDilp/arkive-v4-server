import { Elysia } from "elysia";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { ListCharacterFieldsSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";

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
          .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
          .execute();

        return { data: character_fields, message: MessageEnum.success, ok: true };
      },
      {
        body: ListCharacterFieldsSchema,
        response: ResponseWithDataSchema,
      },
    ),
  );
}
