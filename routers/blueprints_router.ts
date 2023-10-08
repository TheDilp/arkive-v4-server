import Elysia from "elysia";

import { db } from "../database/db";
import { InsertBlueprintSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function blueprints_router(app: Elysia) {
  return app.group("/blueprints", (server) =>
    server.post(
      "/create",
      async ({ body }) => {
        await db.transaction().execute(async (tx) => {
          const newTemplate = await tx.insertInto("blueprints").values(body.data).returning("id").executeTakeFirstOrThrow();

          if (body.relations?.character_fields) {
            await tx
              .insertInto("character_fields")
              .values(
                body.relations.character_fields.map((field) => ({
                  ...field,
                  parent_id: newTemplate.id,
                  options: JSON.stringify(field.options || []),
                })),
              )
              .execute();
          }
          // if (body.relations?.tags) {
          //   await CreateTagRelations({
          //     tx,
          //     relationalTable: "_character_fields_templatesTotags",
          //     id: newTemplate.id,
          //     tags: body.relations.tags,
          //   });
          // }
        });
        return { message: `Blueprint ${MessageEnum.successfully_created}`, ok: true };
      },
      {
        body: InsertBlueprintSchema,
        response: ResponseSchema,
      },
    ),
  );
}
