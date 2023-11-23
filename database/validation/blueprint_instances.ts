import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ parent_id: t.Optional(t.String()) }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          blueprint_fields: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const ReadBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Optional(
      t.Object({
        blueprint_fields: t.Optional(t.Boolean()),
        tags: t.Optional(t.Boolean()),
      }),
    ),
  }),
]);

export const InsertBlueprintInstanceSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    title: t.String(),
    is_public: t.Optional(t.Boolean()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      blueprint_fields: t.Array(
        t.Object({
          id: t.String(), //id of the blueprint field
          characters: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
              }),
            ),
          ),
          blueprint_instances: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
              }),
            ),
          ),
          documents: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
              }),
            ),
          ),
          map_pins: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
              }),
            ),
          ),
          images: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
              }),
            ),
          ),
          random_table: t.Optional(
            t.Union([
              t.Object({
                option_id: t.Optional(t.Union([t.Null(), t.String()])),
                suboption_id: t.Optional(t.Union([t.Null(), t.String()])),
                related_id: t.String(),
              }),
              t.Null(),
            ]),
          ),
          calendar: t.Optional(
            t.Union([
              t.Object({
                start_day: t.Optional(t.Union([t.Number(), t.Null()])),
                start_year: t.Optional(t.Union([t.Number(), t.Null()])),
                start_month_id: t.Optional(t.Union([t.String(), t.Null()])),
                end_day: t.Optional(t.Union([t.Number(), t.Null()])),
                end_month_id: t.Optional(t.Union([t.String(), t.Null()])),
                end_year: t.Optional(t.Union([t.Number(), t.Null()])),
                related_id: t.String(),
              }),
              t.Null(),
            ]),
          ),
          value: t.Optional(
            t.Union([
              t.Array(t.Union([t.String(), t.Number(), t.Null()])),
              t.String(),
              t.Number(),
              t.Null(),
              t.Boolean(),
              t.Record(t.String(), t.Any()),
            ]),
          ),
        }),
      ),
    }),
  ),
});
export const UpdateBlueprintInstanceSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    is_public: t.Optional(t.Boolean()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      blueprint_fields: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            characters: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                }),
              ),
            ),
            blueprint_instances: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                }),
              ),
            ),
            documents: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                }),
              ),
            ),
            map_pins: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                }),
              ),
            ),
            images: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                }),
              ),
            ),
            random_table: t.Optional(
              t.Union([
                t.Object({
                  option_id: t.Optional(t.Union([t.Null(), t.String()])),
                  suboption_id: t.Optional(t.Union([t.Null(), t.String()])),
                  related_id: t.String(),
                }),
                t.Null(),
              ]),
            ),
            calendar: t.Optional(
              t.Union([
                t.Object({
                  start_day: t.Optional(t.Union([t.Number(), t.Null()])),
                  start_year: t.Optional(t.Union([t.Number(), t.Null()])),
                  start_month_id: t.Optional(t.Union([t.String(), t.Null()])),
                  end_day: t.Optional(t.Union([t.Number(), t.Null()])),
                  end_month_id: t.Optional(t.Union([t.String(), t.Null()])),
                  end_year: t.Optional(t.Union([t.Number(), t.Null()])),
                  related_id: t.String(),
                }),
                t.Null(),
              ]),
            ),
            value: t.Optional(
              t.Union([
                t.Array(t.Union([t.String(), t.Number(), t.Null()])),
                t.String(),
                t.Number(),
                t.Null(),
                t.Boolean(),
                t.Record(t.String(), t.Any()),
              ]),
            ),
          }),
        ),
      ),
    }),
  ),
});
