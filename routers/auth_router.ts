import { Elysia } from "elysia";

export function auth_router(app: Elysia) {
  return app.group("/auth", (server) =>
    server
      .get("/signin/discord", async ({ request, redirect, set }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const auth_url = `${process.env.AUTH_SERVICE_URL}/auth/signin/discord?code=${code}`;
        const res = await fetch(
          auth_url,
          // @ts-ignore
          {
            headers: {
              module: "editor",
            },
            method: "GET",
          },
        );

        // @ts-ignore
        set.headers = res.headers;
        set.status = res.status;

        if (res.status < 400) {
          return redirect(`${process.env.EDITOR_CLIENT_URL}/projects` || "thearkive.app", 307);
        }
        return redirect(process.env.HOME_CLIENT_URL || "thearkive.app", 307);
      })
      .post("/status/update", async ({ body, headers, set }) => {
        const res = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/status/update`, {
          // @ts-ignore
          headers,
          body: JSON.stringify(body),
          method: "POST",
        });
        if (res.status < 400 && res.ok) {
          set.headers["set-cookie"] = res.headers.get("set-cookie") as string;
          return res.json();
        } else {
          set.status = 401;
          return "UNAUTHORIZED";
        }
      })
      .get("/signout", async ({ headers, set, cookie }) => {
        try {
          const res = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/signout`, {
            // @ts-ignore
            headers,
            method: "GET",
          });
          if (cookie?.access) {
            cookie?.access?.set?.({
              path: "/",
              value: "",
              maxAge: 0,
              secure: true,
              httpOnly: true,
              priority: "high",
            });
          }
          if (cookie?.refresh) {
            cookie?.refresh?.set?.({
              path: "/",
              value: "",
              maxAge: 0,
              secure: true,
              httpOnly: true,
              priority: "high",
            });
          }

          set.status = res.status;
        } catch (error) {
          console.error("AUTH SIGNOUT ERROR - ", error);
        }

        return "UNAUTHORIZED";
      }),
  );
}
