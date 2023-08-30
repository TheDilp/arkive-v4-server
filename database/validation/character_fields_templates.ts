import { Insertable, Updateable } from "kysely";
import { CharacterFieldsTemplates } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterFieldsTemplateType = Insertable<CharacterFieldsTemplates>;
export type UpdateCharacterFieldsTemplateType = Updateable<CharacterFieldsTemplates>;

export const InsercharacterFieldsTemplateSchema = z.object({
  data: z.object({
    project_id: z.string(),
    title: z.string(),
    sort: z.number().optional(),
  }),
  relations: z.object({
    character_fields: z
      .object({
        title: z.string(),
        project_id: z.string(),
        field_type: z.string(),
        sort: z.number(),
        formula: z.string().nullable().optional(),
        random_table_id: z.string().nullable().optional(),
        options: z.string().array().optional(),
      })
      .array(),
  }),
});

export const UpdateCharacterFieldsTemplateSchema = z.object({
  data: z.object({
    id: z.string(),
    title: z.string(),
    sort: z.number().optional(),
  }),
  relations: z.object({
    character_fields: z
      .object({
        id: z.string(),
        project_id: z.string(),
        title: z.string().optional(),
        field_type: z.string().optional(),
        sort: z.number().optional(),
        formula: z.string().nullable().optional(),
        random_table_id: z.string().nullable().optional(),
        options: z.string().array().optional(),
      })
      .array(),
  }),
});
