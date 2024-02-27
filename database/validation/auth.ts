import { t } from "elysia";

export const AuthSchema = t.Object(
  {
    data: t.Object(
      {
        id: t.String(),
        username: t.Optional(t.Union([t.Null(), t.String()])),
        email_addresses: t.Optional(t.Array(t.Object({ email_address: t.String() }, { additionalProperties: true }))),
      },
      { additionalProperties: true },
    ),
    type: t.Union([t.Literal("user.created"), t.Literal("user.updated"), t.Literal("user.deleted")]),
  },
  { additionalProperties: true },
);
