import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertUserSchema, InviteUserSchema, ReadUserSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function user_router(app: Elysia) {
  return app.group("/users", (server) =>
    server
      .post(
        "/create",
        async () => {
          return { message: MessageEnum.success, ok: true };
        },
        {
          body: InsertUserSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:auth_id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("users")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "users">[]))
            .where("auth_id", "=", params.auth_id)
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadUserSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/invite",
        async ({ body }) => {
          const user = await db.selectFrom("users").select(["id"]).where("email", "=", body.data.email).executeTakeFirst();
          if (user) {
            await db.insertInto("_project_members").values({ A: body.data.project_id, B: user.id }).execute();
            return { message: MessageEnum.success, ok: true };
          } else {
            const newUser = await db
              .insertInto("users")
              .values({ email: body.data.email, nickname: "New user" })
              .returning("id")
              .executeTakeFirst();
            if (newUser) await db.insertInto("_project_members").values({ A: body.data.project_id, B: newUser.id }).execute();

            // Send invite via email

            return { message: MessageEnum.success, ok: true };
          }
        },
        {
          body: InviteUserSchema,
          response: ResponseSchema,
        },
      ),
  );
}
