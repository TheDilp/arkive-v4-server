import { Insertable, Updateable } from "kysely";
import { Words } from "kysely-codegen";
import { z } from "zod";

export type InserWordType = Insertable<Words>;
export type UpdateWordType = Updateable<Words>;

export const InserWordSchema = z.object({
  title: z.string(),
  parent_id: z.string(),
  translation: z.string(),
  description: z.string().nullable().optional(),
});
export const UpdateWordSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  translation: z.string().optional(),
  description: z.string().nullable().optional(),
});
