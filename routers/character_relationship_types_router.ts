import Elysia from "elysia";

import { db } from "../database/db";
import { InsertRelationshipTypeSchema, ListCharacterRelationshipTypeSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function character_relationship_types_router(app: Elysia) {
  return app.group("/character_relationship_types", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("character_relationship_types").values(body.data).execute();
          return { message: `Relationship type ${MessageEnum.successfully_created}`, ok: true };
        },
        { body: InsertRelationshipTypeSchema, response: ResponseSchema },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("character_relationship_types")
            .select(["id", "title", "ascendant_title", "descendant_title"])
            .where("project_id", "=", body.data.project_id)
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        { body: ListCharacterRelationshipTypeSchema, respose: ResponseWithDataSchema },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          await db.deleteFrom("character_relationship_types").where("id", "=", params.id).execute();
          return { message: `Relationship type ${MessageEnum.successfully_deleted}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
