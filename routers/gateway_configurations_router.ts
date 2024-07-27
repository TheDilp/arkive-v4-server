import { Elysia } from "elysia";

import { MessageEnum } from "../enums";
import { ResponseSchema } from "../types/requestTypes";

export function gateway_configurations_router(app: Elysia) {
  return app.group("/gateway_configurations", (server) =>
    server.post(
      "/create",
      async () => {
        return { ok: true, role_access: true, message: `Gateway configuration ${MessageEnum.successfully_created}` };
      },
      {
        response: ResponseSchema,
      },
    ),
  );
}
