import { Elysia } from "elysia";

export function auth_router(app: Elysia) {
  return app.group("/auth", (server) =>
    server
      .get("/signin/discord", async ({ request, redirect, set }) => {
        console.info("START DISCORD AUTH");
        const url = request.url.replace(process.env.ARKIVE_SERVER_URL || "", process.env.AUTH_SERVICE_URL || "");
        console.info("URL ----------->", url);

        const res = await fetch(
          url,
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
        console.info("STATUS ----------->", res.status);

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
        const res = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/signout`, {
          // @ts-ignore
          headers,
          method: "GET",
        });
        cookie.access.remove();
        cookie.refresh.remove();
        set.status = res.status;

        return "UNAUTHORIZED";
      }),
  );
}
