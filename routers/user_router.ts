import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  AssignRoleSchema,
  InsertUserSchema,
  InviteUserSchema,
  KickUserSchema,
  ReadUserSchema,
  UpdateUserSchema,
} from "../database/validation";
import { EmailInvite } from "../emails/EmailInvite";
import { DefaultFeatureFlags } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler } from "../handlers";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { resend } from "../utils/emailClient";
import { decodeUserJwt } from "../utils/requestUtils";

export function user_router(app: Elysia) {
  return app.group("/users", (server) =>
    server
      .post(
        "/create",
        async () => {
          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: InsertUserSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/:project_id/:auth_id",
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
            .$if(!!body.relations?.roles, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("user_roles")
                    .where("user_roles.project_id", "=", params.project_id)
                    .whereRef("user_roles.user_id", "=", "users.id")
                    .select([
                      "user_roles.role_id as id",
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("role_permissions")
                            .whereRef("role_permissions.role_id", "=", "user_roles.role_id")
                            .leftJoin("permissions", "permissions.id", "role_permissions.permission_id")
                            .select(["permissions.code"]),
                        ).as("permissions"),
                    ]),
                ).as("role"),
              ),
            )
            .where("auth_id", "=", params.auth_id)
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadUserSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("users").where("id", "=", params.id).set(body.data).execute();
          return { message: `User ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        { body: UpdateUserSchema, response: ResponseSchema },
      )
      .post(
        "/assign_role",
        async ({ body, headers }) => {
          const token = headers?.["authorization"];
          if (token) {
            const jwt = token.replace("Bearer ", "");
            const { project_id } = decodeUserJwt(jwt);
            await db
              .insertInto("user_roles")
              .values({
                user_id: body.data.user_id,
                role_id: body.data.role_id,
                project_id: project_id as string,
              })
              .onConflict((oc) => oc.columns(["user_id", "role_id", "project_id"]).doUpdateSet({ role_id: body.data.role_id }))
              .execute();
            return { message: MessageEnum.success, ok: true, role_access: true };
          }
          console.error("MISSING TOKEN", "ASSIGN ROLE");
          return { message: "There was an error with this request.", ok: false, role_access: true };
        },
        {
          body: AssignRoleSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
        },
      )
      .post(
        "/invite",
        async ({ body }) => {
          const user = await db.selectFrom("users").select(["id"]).where("email", "=", body.data.email).executeTakeFirst();
          if (user) {
            await db.insertInto("_project_members").values({ A: body.data.project_id, B: user.id }).execute();
          } else {
            const newUser = await db
              .insertInto("users")
              .values({ email: body.data.email, feature_flags: JSON.stringify(DefaultFeatureFlags) })
              .returning("id")
              .executeTakeFirst();
            if (newUser) await db.insertInto("_project_members").values({ A: body.data.project_id, B: newUser.id }).execute();
          }
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
            react: EmailInvite({ project_name: title, image, isRemoved: false }),
          });

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: InviteUserSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeProjectOwnerHandler(context),
        },
      )
      .post(
        "/kick",
        async ({ body }) => {
          await db
            .deleteFrom("_project_members")
            .where("A", "=", body.data.project_id)
            .where("B", "=", body.data.user_id)
            .execute();
          const user = await db.selectFrom("users").select(["email"]).where("id", "=", body.data.user_id).executeTakeFirst();
          if (user) {
            const project = await db
              .selectFrom("projects")
              .select(["title", "image_id"])
              .where("id", "=", body.data.project_id)
              .executeTakeFirst();

            const image = project?.image_id
              ? `https://${process.env.DO_SPACES_NAME}.${process.env.DO_SPACES_CDN_ENDPOINT}/assets/${body.data.project_id}/images/${project.image_id}.webp`
              : "";
            await resend.emails.send({
              from: "The Arkive <emails@thearkive.app>",
              to: [user.email],
              subject: "Arkive project invitation",
              react: EmailInvite({ project_name: project?.title || "", image, isRemoved: true }),
            });
          }

          return { message: MessageEnum.success, ok: true, role_access: true };
        },
        { body: KickUserSchema, response: ResponseSchema, beforeHandle: async (context) => beforeProjectOwnerHandler(context) },
      ),
  );
}
