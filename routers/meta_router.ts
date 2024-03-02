import Elysia, { t } from "elysia";

export function meta_router(app: Elysia) {
  return app.group("/meta", (server) =>
    server.post(
      "/version",
      ({ body, headers }) => {
        if (headers.origin === "https://railway.app") {
          app.server.publish("version", JSON.stringify({ timestamp: body.timestamp }));
        }
      },
      {
        body: t.Object({ timestamp: t.String() }, { additionalProperties: true }),
      },
    ),
  );
}
