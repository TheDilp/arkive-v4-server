import { Insertable, Updateable } from "kysely";
import { Characters } from "kysely-codegen";
import { z } from "zod";

export type InsertCharacterType = Insertable<Characters>;
export type UpdateCharacterType = Updateable<Characters>;

export const InsertCharacterSchema = z.object({
  first_name: z.string(),
  project_id: z.string(),
  last_name: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  portrait_id: z.string().nullable().optional(),
  map_pin_id: z.string().nullable().optional(),
  is_favorite: z.boolean().nullable().optional(),
});
export const UpdateCharacterSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  is_favorite: z.boolean().nullable().optional(),
  portrait_id: z.string().nullable().optional(),
  map_pin_id: z.string().nullable().optional(),
});
export type CharacterColumns = keyof Characters;
