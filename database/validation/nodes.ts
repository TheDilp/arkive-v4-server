import { Insertable, Updateable } from "kysely";
import { Nodes } from "kysely-codegen";
import { z } from "zod";

export type InsertNodeType = Insertable<Nodes>;
export type UpdateNodeType = Updateable<Nodes>;

const NodeShapeEnum = z
  .enum([
    "rectangle",
    "ellipse",
    "triangle",
    "barrel",
    "rhomboid",
    "diamond",
    "pentagon",
    "hexagon",
    "heptagon",
    "octagon",
    "star",
    "cut-rectangle",
    "round-triangle",
    "round-rectangle",
    "bottom-round-rectangle",
    "round-diamond",
    "round-pentagon",
    "round-hexagon",
    "round-heptagon",
    "round-octagon",
  ])
  .nullable()
  .optional();

export const InsertNodeSchema = z
  .object({
    parent_id: z.string(),
    label: z.string().nullable().optional(),
    type: NodeShapeEnum,
    width: z.number().optional(),
    height: z.number().optional(),
    x: z.number(),
    y: z.number(),
    font_size: z.number().nullable().optional(),
    font_color: z.string().nullable().optional(),
    font_family: z.string().nullable().optional(),
    text_v_align: z.string().nullable().optional(),
    text_h_align: z.string().nullable().optional(),
    background_color: z.string().nullable().optional(),
    background_opacity: z.number().nullable().optional(),
    locked: z.boolean().nullable().optional(),
    is_template: z.boolean().nullable().optional(),
    z_index: z.number().nullable().optional(),
    doc_id: z.string().nullable().optional(),
    character_id: z.string().nullable().optional(),
    event_id: z.string().nullable().optional(),
    image_id: z.string().nullable().optional(),
    map_id: z.string().nullable().optional(),
    map_pin_id: z.string().nullable().optional(),
  })
  .strict();

export const UpdateNodeSchema = z
  .object({
    id: z.string().optional(),
    label: z.string().nullable().optional(),
    type: NodeShapeEnum,
    width: z.number().optional(),
    height: z.number().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    font_size: z.number().nullable().optional(),
    font_color: z.string().nullable().optional(),
    font_family: z.string().nullable().optional(),
    text_v_align: z.string().nullable().optional(),
    text_h_align: z.string().nullable().optional(),
    background_color: z.string().nullable().optional(),
    background_opacity: z.number().nullable().optional(),
    locked: z.boolean().nullable().optional(),
    is_template: z.boolean().nullable().optional(),
    is_locked: z.boolean().nullable().optional(),
    z_index: z.number().nullable().optional(),
    doc_id: z.string().nullable().optional(),
    character_id: z.string().nullable().optional(),
    event_id: z.string().nullable().optional(),
    image_id: z.string().nullable().optional(),
    map_id: z.string().nullable().optional(),
    map_pin_id: z.string().nullable().optional(),
  })
  .strict();

export type NodeColumns = keyof Nodes;
