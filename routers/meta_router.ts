import Elysia from "elysia";

export function meta_router(app: Elysia) {
  return app
    .group("/meta", (server) => server.post("/version/:type", () => {}))
    .onStart(async () => {
      const timestamp = new Date().getTime();
      console.log(timestamp);
      app.server.publish("version", JSON.stringify({ timestamp }));
    });
}
