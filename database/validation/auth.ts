import { t } from "elysia";

export const UserCreateSchema = t.Object(
  {
    data: t.Object(
      {
        username: t.Union([t.Null(), t.String()]),
        email_addresses: t.Array(t.Object({ email_address: t.String() }, { additionalProperties: true })),
        image_url: t.Union([t.String(), t.Null()]),
        profile_image_url: t.Union([t.String(), t.Null()]),
      },
      { additionalProperties: true },
    ),
    type: t.Union([t.Literal("user.created")]),
  },
  { additionalProperties: true },
);
