import { compare, genSalt, hash } from "bcryptjs";
import { Elysia, t } from "elysia";

import { db } from "../database/db";
import { EmailSignUp } from "../emails/EmailSignUp";
import { ErrorEnums } from "../enums";
import { DiscordUser, JWTResponse } from "../types/entityTypes";
import { resend } from "../utils/emailClient";
import { extractDiscordAvatar, getCookies, verifyJWT } from "../utils/userUtils";

export function auth_router(app: Elysia) {
  return app.group("/auth" as any, (server) =>
    server
      .onError(({ set }) => {
        set.headers.location = `${process.env.HOME_CLIENT_URL}/signin/editor`;
        set.status = 301;

        return { code: "unable_to_verify" };
      })
      .post(
        "/signup",
        async ({ body }) => {
          if (body.password === body.password_confirm) {
            const salt = await genSalt(10);
            const password_hash = await hash(body.password, salt);

            const user = await db
              .insertInto("users")
              .values({ password: password_hash, email: body.email, nickname: body.nickname })
              .returning("id")
              .executeTakeFirstOrThrow();

            await resend.emails.send({
              from: "The Arkive <emails@thearkive.app>",
              to: [body.email],
              subject: "Arkive signup",
              react: EmailSignUp({ user_id: user.id }),
            });

            return { ok: true, code: "signed_up" };
          }
        },
        {
          body: t.Object({ email: t.String(), nickname: t.String(), password: t.String(), password_confirm: t.String() }),
        },
      )
      .get("/email_confirm/:user_id", async ({ params, redirect }) => {
        await db.updateTable("users").where("users.id", "=", params.user_id).set("is_email_confirmed", true).execute();

        return redirect(`${process.env.HOME_CLIENT_URL}/signin/editor`);
      })
      .get(
        "/signin/discord/:module",
        async ({ query, params, set }) => {
          if (!query?.code) {
            set.status = 301;
            set.headers.location = process.env.HOME_CLIENT_URL as string;
            return { code: "error_logging_in" };
          }

          const client_id = process.env.DISCORD_CLIENT_ID as string;
          const client_secret = process.env.DISCORD_CLIENT_SECRET as string;
          const redirect_uri = `${process.env.REDIRECT_URL}/${params.module}`;

          const res = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id,
              client_secret,
              grant_type: "authorization_code",
              redirect_uri,
              code: query.code,
            }),
          });

          if (res.status >= 400) {
            console.error(await res.json());
            throw new Error("UNAUTHORIZED");
          }

          const data = (await res.json()) as { access_token: string };

          const user_data_res = await fetch("https://discord.com/api/v9/users/@me", {
            method: "GET",
            headers: { Authorization: `Bearer ${data.access_token}` },
          });

          if (user_data_res.status >= 400) {
            console.error(await user_data_res.json());
            throw new Error("UNAUTHORIZED");
          }

          const user_data = (await user_data_res.json()) as DiscordUser;

          const discord_avatar = extractDiscordAvatar(user_data.id, user_data.avatar);

          let user = await db
            .selectFrom("users")
            .select(["id", "email", "image_id", "is_email_confirmed", "nickname"])
            .where("email", "=", user_data.email)
            .executeTakeFirst();
          if (!user) {
            user = await db
              .insertInto("users")
              .values({
                email: user_data.email,
                image_id: discord_avatar,
                is_email_confirmed: true,
                oauth: "discord",
                nickname: "",
              })
              .returning(["id", "email", "image_id", "is_email_confirmed", "nickname"])
              .executeTakeFirst();
          }

          if (user) {
            const cookie_res = await fetch(`${process.env.ARKIVE_AUTH_URL}/tokens`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                project_id: null,
                image_url: user.image_id || null,
                nickname: user.nickname,
                is_email_confirmed: user.is_email_confirmed,
              }),
            });

            if (cookie_res.status >= 400) {
              console.error(await user_data_res.json());
              throw new Error("UNAUTHORIZED");
            }

            const cookie_data = (await cookie_res.json()) as JWTResponse;
            if (cookie_data.access && cookie_data.refresh && cookie_data?.claims) {
              set.headers["set-cookie"] = getCookies(cookie_data.access, cookie_data.refresh);
              set.status = 301;
              set.headers.location = process.env.EDITOR_CLIENT_URL as string;
            } else {
              set.status = 301;
              set.headers.location = process.env.HOME_CLIENT_URL as string;
            }
            return "ok";
          }
          if (params.module !== "editor") {
            throw new Error("UNAUTHORIZED");
          } else {
            set.status = 301;
            set.headers.location = process.env.EDITOR_CLIENT_URL as string;
          }
          return "ok";
        },
        {
          query: t.Object({ code: t.Optional(t.String()) }),
        },
      )
      .post(
        "/signin/password/:module",
        async ({ set, body }) => {
          const user = await db
            .selectFrom("users")
            .select(["id", "image_id", "oauth", "nickname", "is_email_confirmed", "password"])
            .where("users.email", "=", body.email)
            .executeTakeFirst();

          if (user?.password && !user.oauth) {
            const is_confirmed = await compare(body.password, user.password);

            if (!is_confirmed) throw new Error(ErrorEnums.unauthorized);

            const cookie_res = await fetch(`${process.env.ARKIVE_AUTH_URL}/tokens`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                project_id: null,
                image_url: user.image_id || null,
                nickname: user.nickname,
                is_email_confirmed: user.is_email_confirmed,
              }),
            });

            try {
              const cookie_data = (await cookie_res.json()) as JWTResponse;

              if (!cookie_data.claims.is_email_confirmed) throw new Error(ErrorEnums.unauthorized);

              set.headers["set-cookie"] = getCookies(cookie_data.access, cookie_data.refresh);

              set.status = 301;
              set.headers.location = process.env.EDITOR_CLIENT_URL as string;
            } catch (error) {
              console.error(error);
              set.status = 301;
              set.headers.location = process.env.HOME_CLIENT_URL as string;
            }
          }
          set.status = 301;
          set.headers.location = process.env.HOME_CLIENT_URL as string;
          return "ok";
        },
        { body: t.Object({ email: t.String(), password: t.String() }) },
      )
      .get("/status", async ({ cookie: { access, refresh }, set }) => verifyJWT({ access, refresh, set }))
      .post(
        "/status/update",
        async ({ body, set, cookie: { access, refresh } }) => {
          const user = await verifyJWT({ access, refresh, set });

          if (user.status !== "authenticated") {
            throw new Error("UNAUTHENTICATED");
          }

          if (user) {
            const cookie_res = await fetch(`${process.env.ARKIVE_AUTH_URL}/tokens`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.user_id,
                project_id: body.project_id,
                image_url: user.image_url || null,
                nickname: user.name,
                is_email_confirmed: user.is_email_confirmed,
              }),
            });

            try {
              const cookie_data = (await cookie_res.json()) as JWTResponse;

              set.headers["set-cookie"] = getCookies(cookie_data.access, cookie_data.refresh);

              return {
                user_id: cookie_data.claims.user_id,
                project_id: cookie_data.claims.project_id || null,
                image_url: cookie_data.claims.image_url,
                name: cookie_data.claims.name,
                status: "authenticated",
              };
            } catch (error) {
              console.error(error);
              return {
                status: "unauthenticated",
                user_id: null,
                project_id: null,
                image_url: null,
                name: null,
              };
            }
          }
        },
        {
          body: t.Object({ project_id: t.Union([t.String(), t.Null()]) }),
        },
      )
      .get("/signout", async ({ cookie, cookie: { access, refresh } }) => {
        access.remove();
        refresh.remove();

        delete cookie.access;
        delete cookie.refresh;

        return { ok: true, role_access: true, message: "SIGN_OUT." };
      }),
  );
}
