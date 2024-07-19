import { Static, t } from "elysia";

export const JWTModel = t.Object({
  user_id: t.String(),
  image_url: t.String(),
  project_id: t.Union([t.String(), t.Null()]),
  nickname: t.Union([t.String(), t.Null()]),
  is_email_confirmed: t.Boolean(),
});

export type JWTType = Static<typeof JWTModel>;
