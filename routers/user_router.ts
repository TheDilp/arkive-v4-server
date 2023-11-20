import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertUserSchema, InviteUserSchema, ReadUserSchema } from "../database/validation";
import { EmailInvite } from "../emails/EmailInvite";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { resend } from "../utils/emailClient";

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
            .$if(!!body.relations?.webhooks, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb.selectFrom("webhooks").whereRef("webhooks.user_id", "=", "users.id").select(["id", "title"]),
                ).as("webhooks"),
              ),
            )
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

            const { title, image_id } = await db
              .selectFrom("projects")
              .where("id", "=", body.data.project_id)
              .select(["title", "image_id"])
              .executeTakeFirstOrThrow();

            // Send invite via email
            const image = `https://${process.env.DO_SPACES_NAME}.${process.env.DO_SPACES_CDN_ENDPOINT}/assets/${body.data.project_id}/images/${image_id}.webp`;
            await resend.emails.send({
              from: "The Arkive <emails@thearkive.app>",
              to: [body.data.email],
              subject: "Arkive project invitation",
              react: EmailInvite({ project_name: title, image }),
            });

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
