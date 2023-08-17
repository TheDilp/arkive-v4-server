import { Insertable, Updateable } from "kysely";
import { RandomTableOptions, RandomTables, RandomTableSuboptions } from "kysely-codegen";
import { z } from "zod";

export type InsertRandomTableType = Insertable<RandomTables>;
export type UpdateRandomTableType = Updateable<RandomTables>;

export type InsertRandomTableOptionType = Insertable<RandomTableOptions>;
export type UpdateRandomTableOptionType = Updateable<RandomTableOptions>;

export type InsertRandomTableSuboptionType = Insertable<RandomTableSuboptions>;
export type UpdateRandomTableSuboptionType = Updateable<RandomTableSuboptions>;

export const InsertRandomTableOptionSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  parent_id: z.string(),
  icon: z.string().nullable().optional(),
  icon_color: z.string().nullable().optional(),
});

export const InsertRandomTableSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  project_id: z.string(),
  parent_id: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
});
export const UpdateRandomTableSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  project_id: z.string(),
  parent_id: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
});

export const RandomTableSubOptionSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  description: z.string().optional().nullable(),
  parent_id: z.string(),
});
export const UpdateRandomTableSubOptionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional().nullable(),
});
export const UpdateRandomTableOptionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  icon_color: z.string().nullable().optional(),
  suboptions: RandomTableSubOptionSchema.array().optional(),
});
