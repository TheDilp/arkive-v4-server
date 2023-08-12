import { Insertable } from "kysely";
import { _CharacterFieldsTocharacterFieldsTemplates, CharacterFields } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterFieldsType = Insertable<CharacterFields>;
export type InsertCharacterFieldsToTemplatesType = Insertable<_CharacterFieldsTocharacterFieldsTemplates>;

export const insertCharacterFieldsSchema = z
  .object({
    title: z.string(),
    project_id: z.string(),
    sort: z.number().optional(),
    field_type: z.string(),
    options: z.string().array().optional(),
    formula: z.string().nullable().optional(),
  })
  .strict();
