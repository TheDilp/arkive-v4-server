import Elysia, { t } from "elysia";

import { authClient } from "../utils/stytchClient";

export function health_check_router(app: Elysia) {
  return app
    .get("/health_check", async () => {
      return { basecheck: true, ok: true };
    })
    .post(
      "/password_strength",
      async ({ body }) => {
        authClient.passwords
          .strengthCheck(body.data)
          .then((resp) => {
            console.log(resp);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      { body: t.Object({ data: t.Object({ password: t.String() }) }) },
    );
}
