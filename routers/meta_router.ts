import Elysia, { t } from "elysia";

export function meta_router(app: Elysia) {
  return app.group("/meta", (server) =>
    server.post(
      "/version",
      ({ body }) => {
        if (body.type === "DEPLOY" && body?.status === "SUCCESS") {
          const timestamp = new Date().getTime();
          console.log(timestamp);
          app.server.publish("version", JSON.stringify({ timestamp }));
        } else {
          const timestamp = new Date().getTime();
          console.log(timestamp);
          app.server.publish("version", JSON.stringify({ timestamp }));
        }
        return true;
      },
      {
        body: t.Object({ type: t.Literal("DEPLOY"), status: t.Optional(t.String()) }, { additionalProperties: true }),
      },
    ),
  );
}
