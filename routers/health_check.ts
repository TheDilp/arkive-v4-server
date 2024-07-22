import { Elysia } from "elysia";

export function health_check_router(app: Elysia) {
  return app
    .get("/health_check", () => {
      return { message: "Recieved", ok: true };
    })
    .post("/webhook_check", () => {
      return { message: "Success", ok: true };
    });
}
