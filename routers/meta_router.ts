import Elysia, { t } from "elysia";

import { verify_signature } from "../utils/requestUtils";

export function meta_router(app: Elysia) {
  return app.group("/meta", (server) =>
    server.post(
      "/version/:type",
      ({ params, body, headers }) => {
        if (body.ref.endsWith("main")) {
          if (verify_signature(body, headers["x-hub-signature-256"] as string, params.type as "front" | "back")) {
            app.server.publish("version", JSON.stringify({ timestamp: new Date().getTime() }));
          }
        }
        return true;
      },
      {
        body: t.Object({ ref: t.String() }, { additionalProperties: true }),
      },
    ),
  );
}
