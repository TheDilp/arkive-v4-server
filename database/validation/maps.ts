import { Insertable, Updateable } from "kysely";
import { Maps } from "kysely-codegen";
import z from "zod";

export type InsertMapType = Insertable<Maps>;
export type UpdateMapType = Updateable<Maps>;

export const InsertMapSchema = z.object({
  title: z.string(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  cluster_pins: z.boolean().nullable().optional(),
  icon: z.string().nullable().optional(),
  project_id: z.string(),
  parent_id: z.string().nullable().optional(),
  image_id: z.string(),
});

export const UpdateMapSchema = z.object({
  title: z.string().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  cluster_pins: z.boolean().nullable().optional(),
  icon: z.string().nullable().optional(),
  parent_id: z.string().nullable().optional(),
  image_id: z.string().optional(),
});
