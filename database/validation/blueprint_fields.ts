import { Insertable } from "kysely";
import { BlueprintFields } from "kysely-codegen";
import { z } from "zod";

export type InsertBlueprintFieldType = Insertable<BlueprintFields>;

export const insertBlueprintFieldSchema = z.object({
  title: z.string(),
  project_id: z.string(),
  sort: z.number().optional(),
  field_type: z.string(),
  parent_id: z.string(),
  options: z.string().array().optional(),
  formula: z.string().nullable().optional(),
  random_table_id: z.string().nullable().optional(),
});

export const UpdateBlueprintFieldSchema = z.object({
  title: z.string(),
  sort: z.number().optional(),
  field_type: z.string(),
  parent_id: z.string(),
  options: z.string().array().optional(),
  formula: z.string().nullable().optional(),
  random_table_id: z.string().nullable().optional(),
});
