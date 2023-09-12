import Elysia from "elysia";

import { db } from "../database/db";
import { InserWordSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema } from "../types/requestTypes";

export function word_router(app: Elysia) {
  return app.group("/words", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("words").values(body).execute();
          return { ok: true, message: `Word ${MessageEnum.successfully_created}` };
        },
        {
          body: InserWordSchema,
          response: ResponseSchema,
        },
      )

      .delete(
        "/delete/:id",
        async ({ params }) => {
          await db.deleteFrom("words").where("id", "=", params.id).execute();
          return { ok: true, message: MessageEnum.success };
        },
        {
          response: ResponseSchema,
        },
      ),
  );
}
