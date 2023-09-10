import { Insertable, Updateable } from "kysely";
import { Dictionaries } from "kysely-codegen";
import { z } from "zod";

export type InserDictionaryType = Insertable<Dictionaries>;
export type UpdateDictionaryType = Updateable<Dictionaries>;

export const InsertDictionarySchema = z.object({
  title: z.string(),
  project_id: z.string(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  parent_id: z.string().nullable().optional(),
});
export const UpdateDictionarySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  icon: z.string().nullable().optional(),
  is_folder: z.boolean().nullable().optional(),
  is_public: z.boolean().nullable().optional(),
  parent_id: z.string().nullable().optional(),
});
