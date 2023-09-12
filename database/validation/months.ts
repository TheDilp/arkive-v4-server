import { t } from "elysia";

export const InsertMonthSchema = t.Object({
  title: t.String(),
  days: t.Number(),
  sort: t.Number(),
  // Optional because it's being attached to a calendar which will provide the parent_id
  parent_id: t.Optional(t.String()),
});
export const UpdateMonthSchema = t.Object({
  id: t.String(),
  title: t.Optional(t.String()),
  days: t.Optional(t.Number()),
  sort: t.Optional(t.Number()),
});
