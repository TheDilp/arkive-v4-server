import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadUserSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          projects: t.Optional(t.Boolean()),
          webhooks: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertUserSchema = t.Object({});
export const UpdateUserSchema = t.Object({
  data: t.Object({
    feature_flags: t.Optional(t.Union([t.Any(), t.Null()])),
  }),
});
export const InviteUserSchema = t.Object({
  data: t.Object({
    email: t.String(),
    project_id: t.String(),
  }),
});
