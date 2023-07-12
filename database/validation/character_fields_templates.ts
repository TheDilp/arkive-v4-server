import { Insertable, Updateable } from "kysely";
import { CharacterFieldsTemplates } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterFieldsTemplateType = Insertable<CharacterFieldsTemplates>;
export type UpdateCharacterFieldsTemplateType = Updateable<CharacterFieldsTemplates>;

export const UpdateCharacterFieldsTemplateSchema = z
  .object({
    id: z.string().optional(),
    sort: z.number().optional(),
    title: z.string().optional(),
  })
  .strict();
