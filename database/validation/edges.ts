import { Insertable, Updateable } from "kysely";
import { Edges } from "kysely-codegen";
import { z } from "zod";

export type InsertEdgeType = Insertable<Edges>;
export type UpdateEdgeType = Updateable<Edges>;

export const InsertEdgeSchema = z
  .object({
    parent_id: z.string(),
    source_id: z.string(),
    target_id: z.string(),
    label: z.string().nullable().optional(),
    curve_style: z.string().nullable().optional(),
    line_style: z.string().nullable().optional(),
    line_color: z.string().nullable().optional(),
    line_fill: z.string().nullable().optional(),
    line_opacity: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    control_point_distances: z.number().nullable().optional(),
    control_point_weights: z.number().nullable().optional(),
    taxi_direction: z.string().nullable().optional(),
    taxi_turn: z.number().nullable().optional(),
    arrow_scale: z.number().nullable().optional(),

    target_arrow_shape: z.string().nullable().optional(),
    target_arrow_fill: z.string().nullable().optional(),
    target_arrow_color: z.string().nullable().optional(),
    source_arrow_shape: z.string().nullable().optional(),
    source_arrow_fill: z.string().nullable().optional(),
    source_arrow_color: z.string().nullable().optional(),
    mid_target_arrow_shape: z.string().nullable().optional(),
    mid_target_arrlow_fill: z.string().nullable().optional(),
    mid_target_arrlow_color: z.string().nullable().optional(),
    mid_source_arrow_shape: z.string().nullable().optional(),
    mid_source_arrow_fill: z.string().nullable().optional(),
    mid_source_arrow_color: z.string().nullable().optional(),

    font_size: z.number().nullable().optional(),
    font_color: z.string().nullable().optional(),
    font_family: z.string().nullable().optional(),
    z_index: z.number().nullable().optional(),
  })
  .strict();

export const UpdateEdgeSchema = z
  .object({
    label: z.string().nullable().optional(),
    curve_style: z.string().nullable().optional(),
    line_style: z.string().nullable().optional(),
    line_color: z.string().nullable().optional(),
    line_fill: z.string().nullable().optional(),
    line_opacity: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    control_point_distances: z.number().nullable().optional(),
    control_point_weights: z.number().nullable().optional(),
    taxi_direction: z.string().nullable().optional(),
    taxi_turn: z.number().nullable().optional(),
    arrow_scale: z.number().nullable().optional(),

    target_arrow_shape: z.string().nullable().optional(),
    target_arrow_fill: z.string().nullable().optional(),
    target_arrow_color: z.string().nullable().optional(),
    source_arrow_shape: z.string().nullable().optional(),
    source_arrow_fill: z.string().nullable().optional(),
    source_arrow_color: z.string().nullable().optional(),
    mid_target_arrow_shape: z.string().nullable().optional(),
    mid_target_arrlow_fill: z.string().nullable().optional(),
    mid_target_arrlow_color: z.string().nullable().optional(),
    mid_source_arrow_shape: z.string().nullable().optional(),
    mid_source_arrow_fill: z.string().nullable().optional(),
    mid_source_arrow_color: z.string().nullable().optional(),

    font_size: z.number().nullable().optional(),
    font_color: z.string().nullable().optional(),
    font_family: z.string().nullable().optional(),
    z_index: z.number().nullable().optional(),
  })
  .strict();

export type EdgeColumns = keyof Edges;
