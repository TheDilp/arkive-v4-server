import Elysia, { t } from "elysia";

export function meta_router(app: Elysia) {
  return app.group("/meta", (server) =>
    server.post(
      "/version",
      ({ headers, body }) => {
        console.log(headers);
        if (headers.origin === "https://railway.app") {
          if (body.type === "DEPLOY" && body?.status === "SUCCESS") {
            const timestamp = new Date().getTime();
            app.server.publish("version", JSON.stringify({ timestamp }));
          }
          return true;
        }
      },
      {
        body: t.Object({ type: t.Literal("DEPLOY"), status: t.String() }, { additionalProperties: true }),
      },
    ),
  );
}
