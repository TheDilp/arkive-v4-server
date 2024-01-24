import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadEventSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          image: t.Optional(t.Boolean()),
          document: t.Optional(t.Boolean()),
          characters: t.Optional(t.Boolean()),
          map_pins: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertEventSchema = t.Object({
  data: t.Object({
    title: t.String(),
    parent_id: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    background_color: t.Optional(t.Union([t.String(), t.Null()])),
    text_color: t.Optional(t.Union([t.String(), t.Null()])),
    start_day: t.Number(),
    start_month: t.Number(),
    start_month_id: t.String(),
    start_year: t.Number(),
    end_day: t.Optional(t.Union([t.Number(), t.Null()])),
    end_month: t.Optional(t.Union([t.Number(), t.Null()])),
    end_month_id: t.Optional(t.Union([t.String(), t.Null()])),
    end_year: t.Optional(t.Union([t.Number(), t.Null()])),
    start_hours: t.Optional(t.Union([t.Number(), t.Null()])),
    start_minutes: t.Optional(t.Union([t.Number(), t.Null()])),
    end_hours: t.Optional(t.Union([t.Number(), t.Null()])),
    end_minutes: t.Optional(t.Union([t.Number(), t.Null()])),

    document_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      characters: t.Optional(t.Array(t.Object({ id: t.String() }))),
      map_pins: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateEventSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    background_color: t.Optional(t.Union([t.String(), t.Null()])),
    text_color: t.Optional(t.Union([t.String(), t.Null()])),
    start_day: t.Optional(t.Number()),
    start_month: t.Optional(t.Number()),
    start_year: t.Optional(t.Number()),
    end_day: t.Optional(t.Union([t.Number(), t.Null()])),
    end_month: t.Optional(t.Union([t.Number(), t.Null()])),
    end_year: t.Optional(t.Union([t.Number(), t.Null()])),
    start_hours: t.Optional(t.Union([t.Number(), t.Null()])),
    start_minutes: t.Optional(t.Union([t.Number(), t.Null()])),
    end_hours: t.Optional(t.Union([t.Number(), t.Null()])),
    end_minutes: t.Optional(t.Union([t.Number(), t.Null()])),
    document_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      characters: t.Optional(t.Array(t.Object({ id: t.String() }))),
      map_pins: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
