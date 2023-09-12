import { t } from "elysia";

export const InserWordSchema = t.Object({
  title: t.String(),
  parent_id: t.String(),
  translation: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});

export const UpdateWordSchema = t.Object({
  title: t.Optional(t.String()),
  transaltion: t.Optional(t.String()),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});
