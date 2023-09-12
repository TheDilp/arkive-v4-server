import { t } from "elysia";

export const InsertDictionarySchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});

export const UpdateDictionarySchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
