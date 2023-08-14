import { Insertable } from "kysely";
import { CharacterFields } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterFieldsType = Insertable<CharacterFields>;

export const insertCharacterFieldsSchema = z
  .object({
    title: z.string(),
    project_id: z.string(),
    sort: z.number().optional(),
    field_type: z.string(),
    parent_id: z.string(),
    options: z.string().array().optional(),
    formula: z.string().nullable().optional(),
    random_table_id: z.string().nullable().optional(),
  })
  .strict();
