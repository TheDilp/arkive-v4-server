import { Insertable, Updateable } from "kysely";
import { Boards } from "kysely-codegen";
import { z } from "zod";

export type InsertBoardType = Insertable<Boards>;
export type UpdateBoardType = Updateable<Boards>;

export const InsertBoardSchema = z
  .object({
    project_id: z.string(),
    parent_id: z.string().optional(),
    title: z.string().optional(),
    is_folder: z.boolean().optional(),
    is_public: z.boolean().optional(),
    icon: z.string().optional(),
    default_node_shape: z.string().optional(),
    default_node_color: z.string().optional(),
    default_edge_color: z.string().optional(),
  })
  .strict();

export const UpdateBoardSchema = z
  .object({
    id: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    title: z.string().optional(),
    is_folder: z.boolean().nullable().optional(),
    is_public: z.boolean().nullable().optional(),
    icon: z.string().nullable().optional(),
    default_node_shape: z.string().optional(),
    default_node_color: z.string().optional(),
    default_edge_color: z.string().optional(),
  })
  .strict();

export type BoardColumns = keyof Boards;
