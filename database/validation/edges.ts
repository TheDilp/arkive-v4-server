import { t } from "elysia";

export const ReadEdgeSchema = t.Object({
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Boolean()),
    }),
  ),
});

export const InsertEdgeSchema = t.Object({
  data: t.Object({
    id: t.String(),
    parent_id: t.String(),
    source_id: t.String(),
    target_id: t.String(),
    label: t.Optional(t.Union([t.String(), t.Null()])),
    curve_style: t.Optional(t.Union([t.String(), t.Null()])),
    line_style: t.Optional(t.Union([t.String(), t.Null()])),
    line_color: t.Optional(t.Union([t.String(), t.Null()])),
    line_fill: t.Optional(t.Union([t.String(), t.Null()])),
    line_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
    width: t.Optional(t.Union([t.Number(), t.Null()])),
    control_point_distances: t.Optional(t.Union([t.Number(), t.Null()])),
    control_point_weights: t.Optional(t.Union([t.Number(), t.Null()])),
    taxi_direction: t.Optional(t.Union([t.String(), t.Null()])),
    taxi_turn: t.Optional(t.Union([t.Number(), t.Null()])),
    arrow_scale: t.Optional(t.Union([t.Number(), t.Null()])),

    target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    target_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    target_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrlow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrlow_color: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),

    font_size: t.Optional(t.Union([t.Number(), t.Null()])),
    font_color: t.Optional(t.Union([t.String(), t.Null()])),
    font_family: t.Optional(t.Union([t.String(), t.Null()])),
    z_index: t.Optional(t.Union([t.Number(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateEdgeSchema = t.Object({
  data: t.Object({
    label: t.Optional(t.Union([t.String(), t.Null()])),
    curve_style: t.Optional(t.Union([t.String(), t.Null()])),
    line_style: t.Optional(t.Union([t.String(), t.Null()])),
    line_color: t.Optional(t.Union([t.String(), t.Null()])),
    line_fill: t.Optional(t.Union([t.String(), t.Null()])),
    line_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
    width: t.Optional(t.Union([t.Number(), t.Null()])),
    control_point_distances: t.Optional(t.Union([t.Number(), t.Null()])),
    control_point_weights: t.Optional(t.Union([t.Number(), t.Null()])),
    taxi_direction: t.Optional(t.Union([t.String(), t.Null()])),
    taxi_turn: t.Optional(t.Union([t.Number(), t.Null()])),
    arrow_scale: t.Optional(t.Union([t.Number(), t.Null()])),

    target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    target_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    target_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrlow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    mid_target_arrlow_color: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
    mid_source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),

    font_size: t.Optional(t.Union([t.Number(), t.Null()])),
    font_color: t.Optional(t.Union([t.String(), t.Null()])),
    font_family: t.Optional(t.Union([t.String(), t.Null()])),
    z_index: t.Optional(t.Union([t.Number(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const DeleteManyEdgeSchema = t.Object({ data: t.Array(t.Object({ id: t.String() })) });
