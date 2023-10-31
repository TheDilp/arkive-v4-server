import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadUserSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          projects: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertUserSchema = t.Object({});
