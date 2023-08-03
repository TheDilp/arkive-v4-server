import { Insertable, Updateable } from "kysely";
import { Documents } from "kysely-codegen";
import { z } from "zod";

export type InsertDocumentType = Insertable<Documents>;
export type UpdateDocumentType = Updateable<Documents>;

export const InsertDocumentSchema = z.object({
  project_id: z.string(),
  title: z.string().optional(),
  content: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  is_template: z.boolean().nullable().optional(),
  parent_id: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});
export const UpdateDocumentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  is_template: z.boolean().nullable().optional(),
  parent_id: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});
