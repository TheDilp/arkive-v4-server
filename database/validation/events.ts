import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadEventSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({}) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          image: t.Optional(t.Boolean()),
          document: t.Optional(t.Boolean()),
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
    start_year: t.Number(),
    end_day: t.Optional(t.Union([t.Number(), t.Null()])),
    end_month: t.Optional(t.Union([t.Number(), t.Null()])),
    end_year: t.Optional(t.Union([t.Number(), t.Null()])),
    hours: t.Optional(t.Union([t.Number(), t.Null()])),
    minutes: t.Optional(t.Union([t.Number(), t.Null()])),

    document_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
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
    hours: t.Optional(t.Union([t.Number(), t.Null()])),
    minutes: t.Optional(t.Union([t.Number(), t.Null()])),

    document_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
