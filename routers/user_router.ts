import { Elysia, t } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertUserSchema, InviteUserSchema, KickUserSchema, ReadUserSchema, UpdateUserSchema } from "../database/validation";
import { EmailInvite } from "../emails/EmailInvite";
import { DefaultProjectFeatureFlags, ErrorEnums, NicknameInUse } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { beforeProjectOwnerHandler } from "../handlers";
import { GatewayAccessType } from "../types/entityTypes";
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
        async ({ params, permissions, body }) => {
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
            .$if(!!body.relations?.roles && !!permissions.project_id, (qb) =>
              qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("user_roles")
                    .where("user_roles.project_id", "=", permissions.project_id as string)
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
              try {
                user = await tx.updateTable("users").where("id", "=", params.id).set(body.data).returning("id").execute();
              } catch (error) {
                // @ts-ignore
                if (error.code === "23505" && body.data?.nickname) {
                  throw new NicknameInUse(ErrorEnums.nickname_in_use);
                }
              }
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
        "/invite",
        async ({ body, permissions }) => {
          if (permissions.project_id) {
            const user = await db.selectFrom("users").select(["id"]).where("email", "=", body.data.email).executeTakeFirst();
            if (user) {
              await db.insertInto("_project_members").values({ A: permissions.project_id, B: user.id }).execute();
              await db
                .insertInto("user_project_feature_flags")
                .values({
                  project_id: permissions.project_id,
                  user_id: user.id,
                  feature_flags: JSON.stringify(DefaultProjectFeatureFlags),
                })
                .execute();
            } else {
              return { ok: false, role_access: true, message: "User must already have an account on the Arkive." };
              // const newUser = await db.insertInto("users").values({ email: body.data.email }).returning("id").executeTakeFirst();
              // if (newUser) {
              //   await db.insertInto("_project_members").values({ A: permissions.project_id, B: newUser.id }).execute();
              //   await db
              //     .insertInto("user_project_feature_flags")
              //     .values({
              //       project_id: permissions.project_id,
              //       user_id: newUser.id,
              //       feature_flags: JSON.stringify(DefaultProjectFeatureFlags),
              //     })
              //     .execute();
              // }
            }
          }
          const { title, image_id } = await db
            .selectFrom("projects")
            .where("id", "=", permissions.project_id)
            .select(["title", "image_id"])
            .executeTakeFirstOrThrow();

          // Send invite via email
          const image = `https://${process.env.DO_SPACES_NAME}.${process.env.DO_SPACES_CDN_ENDPOINT}/assets/${permissions.project_id}/images/${image_id}.webp`;
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
          if (permissions.project_id) {
            const redis = await redisClient;
            let code = "";
            const access_id = crypto.randomUUID();

            for (let index = 0; index < 6; index++) {
              const number = Math.random().toString()[3 + index];
              code += number;
            }

            const data = {
              access_id,
              code,
              project_id: permissions.project_id,
              config: body.data.config,
            };

            if (body.data.gateway_type === "update" && body.data.entity_id) {
              const entity = await db
                .selectFrom(body.data.type)
                .select(["id", body.data.type === "characters" ? "full_name as title" : "title"])
                .where("id", "=", body.data.entity_id)
                .executeTakeFirst();

              if (entity?.id) {
                const config: GatewayAccessType = { ...data, gateway_type: body.data.gateway_type, entity_id: entity?.id };

                await redis.SET(`${body.data.type}_gateway_access_${access_id}`, JSON.stringify(config), { EX: 60 * 60 * 6 });

                // await resend.emails.send({
                //   from: "The Arkive <emails@thearkive.app>",
                //   to: [body.data.email],
                //   subject: "Arkive gateway access",
                //   react: EmailGateway({
                //     title: entity?.title || "",
                //     type: body.data.type,
                //     code,
                //     gateway_type: body.data.gateway_type,
                //     link: `${access_id}/${entity?.id || ""}/${body.data.gateway_type}`,
                //   }),
                // });
              }
            } else if (body.data.gateway_type === "create") {
              const config: GatewayAccessType = {
                ...data,
                create_config: body.data.create_config,
                gateway_type: body.data.gateway_type,
              };

              await redis.SET(`${body.data.type}_gateway_access_${access_id}`, JSON.stringify(config), { EX: 60 * 60 * 6 });
              // await resend.emails.send({
              //   from: "The Arkive <emails@thearkive.app>",
              //   to: [body.data.email],
              //   subject: "Arkive gateway access",
              //   react: EmailGateway({
              //     title: "Create character",
              //     type: body.data.type,
              //     code,
              //     gateway_type: body.data.gateway_type,
              //     link: `${access_id}/${body.data.gateway_type}`,
              //   }),
              // });
            }
            return {
              code,
              link: `${process.env.GATEWAY_CLIENT_URL}/${body.data.type}/${access_id}/${body.data.gateway_type}${
                body.data.gateway_type === "update" ? `/${body.data.entity_id}` : ""
              }`,
            };
          } else {
            return { ok: false, message: "No permission for project" };
          }
        },
        {
          body: t.Object(
            {
              data: t.Intersect([
                t.Object({
                  type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
                  config: t.Record(
                    t.Union([
                      t.Literal("characters"),
                      t.Literal("blueprint_instances"),
                      t.Literal("documents"),
                      t.Literal("maps"),
                      t.Literal("map_pins"),
                      t.Literal("events"),
                      t.Literal("images"),
                      t.Literal("random_tables"),
                      t.Literal("tags"),
                    ]),
                    t.Array(t.String()),
                  ),
                }),
                t.Union([
                  t.Object({
                    gateway_type: t.Literal("update"),
                    entity_id: t.String(),
                  }),
                  t.Object({
                    gateway_type: t.Literal("create"),
                    create_config: t.Union([
                      t.Intersect([
                        t.Object({
                          is_locked: t.Literal(true),
                        }),
                        t.Union([
                          t.Object({
                            first_name: t.String(),
                            last_name: t.String(),
                          }),
                          t.Object({ title: t.String() }),
                        ]),
                      ]),

                      t.Object({
                        is_locked: t.Literal(false),
                        first_name: t.Optional(t.String()),
                        last_name: t.Optional(t.String()),
                        title: t.Optional(t.String()),
                        parent_id: t.Optional(t.String()),
                      }),
                    ]),
                  }),
                ]),
              ]),
            },
            { additionalProperties: false },
          ),
        },
      )
      .post(
        "/kick",
        async ({ body, permissions }) => {
          await db
            .deleteFrom("_project_members")
            .where("A", "=", permissions.project_id)
            .where("B", "=", body.data.user_id)
            .execute();
          const user = await db.selectFrom("users").select(["email"]).where("id", "=", body.data.user_id).executeTakeFirst();
          if (user) {
            const project = await db
              .selectFrom("projects")
              .select(["title", "image_id"])
              .where("id", "=", permissions.project_id)
              .executeTakeFirst();

            const image = project?.image_id
              ? `https://${process.env.DO_SPACES_NAME}.${process.env.DO_SPACES_CDN_ENDPOINT}/assets/${permissions.project_id}/images/${project.image_id}.webp`
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
