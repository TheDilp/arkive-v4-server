import { Insertable, Updateable } from "kysely";
import { CharacterFieldsTemplates } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterFieldsTemplateType = Insertable<CharacterFieldsTemplates>;
export type UpdateCharacterFieldsTemplateType = Updateable<CharacterFieldsTemplates>;

export const InsercharacterFieldsTemplateSchema = z.object({
  project_id: z.string(),
  title: z.string(),
  sort: z.number().optional(),
});

export const UpdateCharacterFieldsTemplateSchema = z.object({
  id: z.string().optional(),
  sort: z.number().optional(),
  title: z.string().optional(),
});
