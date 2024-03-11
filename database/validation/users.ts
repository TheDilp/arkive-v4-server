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
          roles: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
  t.Object({
    data: t.Object({
      auth_id: t.String(),
      project_id: t.Optional(t.String()),
    }),
  }),
]);

export const InsertUserSchema = t.Object({});
export const UpdateUserSchema = t.Object({
  data: t.Object({
    feature_flags: t.Optional(t.Union([t.Any(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      role: t.Optional(t.String()),
    }),
  ),
});
export const AssignRoleSchema = t.Object({
  data: t.Object({
    user_id: t.String(),
    role_id: t.String(),
  }),
});
export const InviteUserSchema = t.Object({
  data: t.Object({
    email: t.String(),
    project_id: t.String(),
  }),
});
export const KickUserSchema = t.Object({
  data: t.Object({
    user_id: t.String(),
    project_id: t.String(),
  }),
});
