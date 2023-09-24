import Elysia from "elysia";

import { db } from "../database/db";
import { InsertRelationshipTypeSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function character_relationship_types_router(app: Elysia) {
  return app.group("/character_relationship_types", (server) =>
    server.post(
      "/create",
      async ({ body }) => {
        await db.insertInto("character_relationship_types").values(body.data).execute();
        return { message: `Relationship type ${MessageEnum.successfully_created}`, ok: true };
      },
      { body: InsertRelationshipTypeSchema, response: ResponseSchema },
    ),
  );
}
