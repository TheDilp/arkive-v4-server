import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";
import { InsertMonthSchema, UpdateMonthSchema } from ".";

export const ReadCalendarSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({}) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          months: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertCalendarSchema = t.Object({
  data: t.Object({
    title: t.String(),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    project_id: t.String(),
    // offset: z.number(),
    hours: t.Optional(t.Union([t.Number(), t.Null()])),
    minutes: t.Optional(t.Union([t.Number(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    days: t.Array(t.String(), { minItems: 1 }),
  }),
  relations: t.Object({
    months: t.Array(InsertMonthSchema, { minItems: 1 }),
    tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
  }),
});

export const UpdateCalendarSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    days: t.String().array().min(1).optional(),
  }),
  relations: t.Object({
    months: t.Union([t.Array(InsertMonthSchema, { minItems: 1 }), t.Array(UpdateMonthSchema, { minItems: 1 })]),
    tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
  }),
});
