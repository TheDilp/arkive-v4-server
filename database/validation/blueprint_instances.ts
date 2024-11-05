import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ parent_id: t.Optional(t.String()), project_id: t.Optional(t.String()) }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          blueprint: t.Optional(t.Boolean()),
          blueprint_fields: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);
export const PublicListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
]);

export const ReadBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
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
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
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
                sort: t.Number(),
              }),
            ),
          ),
          blueprint_instances: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
                sort: t.Number(),
              }),
            ),
          ),
          documents: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
                sort: t.Number(),
              }),
            ),
          ),
          map_pins: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
                sort: t.Number(),
              }),
            ),
          ),
          events: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
                sort: t.Number(),
              }),
            ),
          ),
          images: t.Optional(
            t.Array(
              t.Object({
                related_id: t.String(),
                sort: t.Number(),
              }),
            ),
          ),
          random_table: t.Optional(
            t.Union([
              t.Object({
                option_id: t.Optional(t.Union([t.Null(), t.String()])),
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
export const UpdateBlueprintInstanceSchema = t.Object({
  data: t.Object({
    id: t.String(),
    deleted_at: t.Optional(t.Union([t.String(), t.Null()])),
    title: t.Optional(t.String()),
    owner_id: t.Optional(t.String()),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
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
                  sort: t.Number(),
                }),
              ),
            ),
            blueprint_instances: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                  sort: t.Number(),
                }),
              ),
            ),
            documents: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                  sort: t.Number(),
                }),
              ),
            ),
            map_pins: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                  sort: t.Number(),
                }),
              ),
            ),
            events: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                  sort: t.Number(),
                }),
              ),
            ),
            images: t.Optional(
              t.Array(
                t.Object({
                  related_id: t.String(),
                  sort: t.Number(),
                }),
              ),
            ),
            random_table: t.Optional(
              t.Union([
                t.Object({
                  option_id: t.Optional(t.Union([t.Null(), t.String()])),
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
  permissions: t.Optional(
    t.Array(
      t.Intersect([
        t.Object({ related_id: t.String() }),

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
