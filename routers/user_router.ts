import { Elysia, t } from "elysia";
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
import { EmailGateway } from "../emails/EmailGateway";
import { EmailInvite } from "../emails/EmailInvite";
import { DefaultProjectFeatureFlags } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { resend } from "../utils/emailClient";
import { redisClient } from "../utils/redisClient";

export function user_router(app: Elysia) {
  return app.group("/users", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        project_id: null,
        permission_id: null,
      } as PermissionDecorationType)
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
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("users")
            .select(body.fields as SelectExpression<DB, "users">[])
            .$if(!!body.relations?.webhooks, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb.selectFrom("webhooks").whereRef("webhooks.user_id", "=", "users.id").select(["id", "title"]),
                ).as("webhooks"),
              ),
            )
            .$if(!!body.relations?.roles && !!body.data.project_id, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("user_roles")
                    .where("user_roles.project_id", "=", body.data.project_id as string)
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
            .where("id", "=", params.id)
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
          const redis = await redisClient;
          await db.transaction().execute(async (tx) => {
            let user;
            if (body.data) {
              user = await tx.updateTable("users").where("id", "=", params.id).set(body.data).returning("id").execute();

              // Clear cached
              if (user?.[0]) {
                await redis.del(`notification_flags_${params.id}`);
              }
            }
            if (body.relations?.feature_flags) {
              await tx
                .insertInto("user_project_feature_flags")
                .values({
                  feature_flags: body.relations.feature_flags.feature_flags,
                  project_id: body.relations.feature_flags.project_id,
                  user_id: params.id,
                })
                .onConflict((oc) =>
                  oc
                    .columns(["project_id", "user_id"])
                    .doUpdateSet({ feature_flags: body.relations?.feature_flags?.feature_flags }),
                )
                .execute();
              if (user) {
                await redis.set(
                  `notification_flags_${params.id}`,
                  JSON.stringify(body.relations?.feature_flags?.feature_flags),
                  {
                    EX: 60 * 60,
                  },
                );
              }
            }
          });

          return { message: `User ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
        },
        {
          body: UpdateUserSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/assign_role",
        async ({ body, headers }) => {
          const project_id = headers?.["project-id"];
          await db
            .insertInto("user_roles")
            .values({
              user_id: body.data.user_id,
              role_id: body.data.role_id,
              project_id: project_id as string,
            })
            .onConflict((oc) => oc.columns(["user_id", "project_id"]).doUpdateSet({ role_id: body.data.role_id }))
            .execute();
          return { message: MessageEnum.success, ok: true, role_access: true };
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
            await db
              .insertInto("user_project_feature_flags")
              .values({
                project_id: body.data.project_id,
                user_id: user.id,
                feature_flags: JSON.stringify(DefaultProjectFeatureFlags),
              })
              .execute();
          } else {
            return { ok: false, role_access: true, message: "User must already have an account on the Arkive." };
            // const newUser = await db.insertInto("users").values({ email: body.data.email }).returning("id").executeTakeFirst();
            // if (newUser) {
            //   await db.insertInto("_project_members").values({ A: body.data.project_id, B: newUser.id }).execute();
            //   await db
            //     .insertInto("user_project_feature_flags")
            //     .values({
            //       project_id: body.data.project_id,
            //       user_id: newUser.id,
            //       feature_flags: JSON.stringify(DefaultProjectFeatureFlags),
            //     })
            //     .execute();
            // }
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
        "/gateway/invite",
        async ({ body, permissions }) => {
          const redis = await redisClient;
          const entity = await db
            .selectFrom(body.data.type)
            .select(["id", body.data.type === "characters" ? "full_name as title" : "title"])
            .where("id", "=", body.data.id)
            .executeTakeFirst();

          if (entity?.id && permissions.project_id) {
            const access_id = crypto.randomUUID();

            let code = "";

            for (let index = 0; index < 6; index++) {
              const number = Math.random().toString()[3 + index];
              code += number;
            }

            await redis.SET(
              `${body.data.type}_gateway_access_${access_id}`,
              JSON.stringify({
                access_id,
                entity_id: entity.id,
                code,
                project_id: permissions.project_id,
                config: body.data.config,
              }),
              { EX: 60 * 60 * 6 },
            );

            await resend.emails.send({
              from: "The Arkive <emails@thearkive.app>",
              to: [body.data.email],
              subject: "Arkive gateway access",
              react: EmailGateway({
                title: entity?.title || "",
                type: body.data.type,
                code,
                link: `${access_id}/${entity?.id || ""}`,
              }),
            });
          }

          return {};
        },
        {
          body: t.Object(
            {
              data: t.Object({
                email: t.String(),
                id: t.String(),
                type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
                config: t.Record(t.String(), t.Array(t.String())),
              }),
            },
            { additionalProperties: false },
          ),
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
