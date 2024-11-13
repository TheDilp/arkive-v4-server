import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableOptionSchema = RequestBodySchema;

export const ListRandomTableOptionsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);

export const ListRandomTableOptionsByParentSchema = t.Object({ data: t.Object({ count: t.Number() }) });

export const ListRandomTableOptionRandomManySchema = t.Object({
  data: t.Array(t.Object({ table_id: t.String(), count: t.Number() })),
});

export const InsertRandomTableOptionItemSchema = t.Object({
  title: t.String(),
  parent_id: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  icon: t.Optional(t.Union([t.String(), t.Null()])),
  icon_color: t.Optional(t.Union([t.String(), t.Null()])),
  character_id: t.Optional(t.Union([t.String(), t.Null()])),
  blueprint_instance_id: t.Optional(t.Union([t.String(), t.Null()])),
  document_id: t.Optional(t.Union([t.String(), t.Null()])),
  map_id: t.Optional(t.Union([t.String(), t.Null()])),
  map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
  graph_id: t.Optional(t.Union([t.String(), t.Null()])),
  event_id: t.Optional(t.Union([t.String(), t.Null()])),
  word_id: t.Optional(t.Union([t.String(), t.Null()])),
  image_id: t.Optional(t.Union([t.String(), t.Null()])),
});

export const InsertRandomTableOptionSchema = t.Object({
  data: t.Array(t.Object({ data: InsertRandomTableOptionItemSchema })),
});

export const UpdateRandomTableOptionSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    icon_color: t.Optional(t.Union([t.String(), t.Null()])),
    character_id: t.Optional(t.Union([t.String(), t.Null()])),
    blueprint_instance_id: t.Optional(t.Union([t.String(), t.Null()])),
    document_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
    graph_id: t.Optional(t.Union([t.String(), t.Null()])),
    event_id: t.Optional(t.Union([t.String(), t.Null()])),
    word_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
