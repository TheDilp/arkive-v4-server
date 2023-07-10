import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertCharacterFieldsType } from "../database/validation/character_fields";
import { InsertCharacterFieldsTemplateType } from "../database/validation/character_fields_templates";

export function character_fields_templates_router(server: FastifyInstance, _: any, done: any) {
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: InsertCharacterFieldsTemplateType;
          relations: { character_fields: InsertCharacterFieldsType[] };
        };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        const newTemplate = await tx
          .insertInto("character_fields_templates")
          .values(req.body.data)
          .returning("id")
          .executeTakeFirstOrThrow();

        const newFields = await tx
          .insertInto("character_fields")
          .values(req.body.relations.character_fields)
          .returning("id")
          .execute();

        tx.insertInto("_character_fieldsTocharacter_fields_templates").values(
          newFields.map((field) => ({ A: field.id, B: newTemplate.id })),
        );
      });

      rep.send({ message: "Template and fields successfully created.", ok: true });
    },
  );

  done();
}
