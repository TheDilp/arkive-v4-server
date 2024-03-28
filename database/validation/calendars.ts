import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const InsertEraSchema = t.Object({
  data: t.Object({
    title: t.String(),
    days: t.Number(),
    start_day: t.Number(),
    start_month: t.Number(),
    start_month_id: t.String(),
    start_year: t.Number(),
    end_day: t.Number(),
    end_month: t.Number(),
    end_month_id: t.String(),
    end_year: t.Number(),
    color: t.String(),
    // Optional because it's being attached to a calendar which will provide the parent_id
    parent_id: t.Optional(t.String()),
  }),
});
export const UpdateEraSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    days: t.Optional(t.Number()),
    start_day: t.Optional(t.Number()),
    start_month: t.Optional(t.Number()),
    start_month_id: t.Optional(t.String()),
    start_year: t.Optional(t.Number()),
    end_day: t.Optional(t.Number()),
    end_month: t.Optional(t.Number()),
    end_month_id: t.Optional(t.String()),
    end_year: t.Optional(t.Number()),
    color: t.Optional(t.String()),
  }),
});

export const InsertMonthSchema = t.Object({
  data: t.Object({
    title: t.String(),
    days: t.Number(),
    sort: t.Number(),
    // Optional because it's being attached to a calendar which will provide the parent_id
    parent_id: t.Optional(t.String()),
  }),
});
export const UpdateMonthSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    days: t.Optional(t.Number()),
    sort: t.Optional(t.Number()),
  }),
});

export const InsertLeapDaySchema = t.Object({
  data: t.Object({
    month_id: t.String(),
    parent_id: t.String(),
    conditions: t.Any(),
  }),
});
export const UpdateLeapDaySchema = t.Object({
  data: t.Object({
    month_id: t.Optional(t.String()),
    conditions: t.Optional(t.Any()),
  }),
});

export const ReadCalendarSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          eras: t.Optional(t.Boolean()),
          leap_days: t.Optional(t.Boolean()),
          months: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);
export const ListCalendarSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }), relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })) }),
]);
export const InsertCalendarSchema = t.Object({
  data: t.Object({
    title: t.String(),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    project_id: t.String(),
    // offset: z.number(),
    starts_on_day: t.Optional(t.Union([t.Number(), t.Null()])),
    hours: t.Optional(t.Union([t.Number(), t.Null()])),
    minutes: t.Optional(t.Union([t.Number(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    days: t.Optional(t.Array(t.String(), { minItems: 1 })),
  }),
  relations: t.Object({
    eras: t.Optional(t.Array(InsertEraSchema)),
    months: t.Optional(t.Array(InsertMonthSchema, { minItems: 1 })),
    tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    leap_days: t.Optional(t.Array(InsertLeapDaySchema)),
  }),
  permissions: t.Optional(
    t.Array(
      t.Intersect([
        t.Object({ related_id: t.Optional(t.Null()) }),
        t.Union([
          t.Object({
            permission_id: t.String(),
            user_id: t.String(),
            role_id: t.Null(),
          }),
          t.Object({
            permission_id: t.Null(),
            user_id: t.Null(),
            role_id: t.String(),
          }),
        ]),
      ]),
    ),
  ),
});

export const UpdateCalendarSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    days: t.Optional(t.Array(t.String(), { minItems: 1 })),
    starts_on_day: t.Optional(t.Union([t.Number(), t.Null()])),
  }),
  relations: t.Object({
    eras: t.Union([t.Array(InsertEraSchema), t.Array(UpdateEraSchema)]),
    months: t.Union([t.Array(InsertMonthSchema, { minItems: 1 }), t.Array(UpdateMonthSchema, { minItems: 1 })]),
    tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    leap_days: t.Optional(t.Union([t.Array(InsertLeapDaySchema), t.Array(UpdateLeapDaySchema)])),
  }),
});
