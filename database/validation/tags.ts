import { Insertable, Updateable } from "kysely";
import { Tags } from "kysely-codegen";
import { z } from "zod";

export type InsertTagType = Insertable<Tags>;
export type UpdateTagType = Updateable<Tags>;

export const InsertTagSchema = z
  .object({
    title: z.string(),
    color: z.string().optional(),
    project_id: z.string(),
  })
  .strict()
  .or(
    z
      .object({
        title: z.string(),
        color: z.string().optional(),
        project_id: z.string(),
      })
      .strict()
      .array(),
  );

export const UpdateTagSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    color: z.string().optional(),
  })
  .strict();
