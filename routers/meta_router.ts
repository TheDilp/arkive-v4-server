import Elysia from "elysia";

export function meta_router(app: Elysia) {
  return app
    .group("/meta", (server) => server.post("/version/:type", () => {}))
    .onStart(async () => {
      app.server.publish("version", JSON.stringify({ timestamp: new Date().getTime() }));
    });
}
