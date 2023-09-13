import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableOptionSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          suboptions: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const ListRandomTableOptionsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ suboptions: t.Optional(t.Boolean()) })),
    }),
  ),
]);

export const ListRandomTableOptionsByParentSchema = t.Object({ data: t.Object({ count: t.Number() }) });

export const ListRandomTableOptionRandomManySchema = t.Object({
  data: t.Array(t.Object({ table_id: t.String(), count: t.Number() })),
});

export const RandomTableSubOptionSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  parent_id: t.String(),
});

export const InsertRandomTableSubOptionSchema = t.Object({
  title: t.String(),
  parent_id: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});
export const UpdateRandomTableSubOptionSchema = t.Object({
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});

export const InsertRandomTableOptionItemSchema = t.Object({
  title: t.String(),
  parent_id: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  icon: t.Optional(t.Union([t.String(), t.Null()])),
  icon_color: t.Optional(t.Union([t.String(), t.Null()])),
});

export const InsertRandomTableOptionSchema = t.Object({
  data: t.Array(InsertRandomTableOptionItemSchema),
  relations: t.Object({ suboptions: t.Optional(t.Array(InsertRandomTableSubOptionSchema)) }),
});

export const UpdateRandomTableOptionSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    icon_color: t.Optional(t.Union([t.String(), t.Null()])),
    suboptions: t.Optional(t.Array(RandomTableSubOptionSchema)),
  }),
  relations: t.Object({
    suboptions: t.Optional(t.Array(t.Union([InsertRandomTableSubOptionSchema, UpdateRandomTableSubOptionSchema]))),
  }),
});
