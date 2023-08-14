import { FastifyInstance, FastifyRequest } from "fastify";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "../database/db";
import { RequestBodyType } from "../types/requestTypes";

export function character_fields_router(server: FastifyInstance, _: any, done: any) {
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
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

      .where("character_fields.parent_id", "=", req.body.data.parent_id)
      .execute();

    rep.send({ data: character_fields, message: "Success.", ok: true });
  });

  done();
}
