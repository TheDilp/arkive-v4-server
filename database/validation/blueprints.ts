import { Insertable, Updateable } from "kysely";
import { BlueprintTemplate } from "kysely-codegen";
import { z } from "zod";

export type InsertBlueprintTemplateType = Insertable<BlueprintTemplate>;
export type UpdateBlueprintTemplateType = Updateable<BlueprintTemplate>;

export const InsertBlueprintTemplateSchema = z.object({
  id: z.string().optional(),
  sort: z.number().optional(),
  project_id: z.string(),
  title: z.string().optional(),
});
export const UpdateBlueprintTemplateSchema = z.object({
  id: z.string().optional(),
  sort: z.number().optional(),
  title: z.string().optional(),
});
