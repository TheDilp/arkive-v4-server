import { Insertable, Updateable } from "kysely";
import { Projects } from "kysely-codegen";
import { z } from "zod";

export type InsertProjectType = Insertable<Projects>;
export type UpdateProjectType = Pick<Updateable<Projects>, "title" | "image_id">;

export const UpdateProjectSchema = z
  .object({
    title: z.string().optional(),
    image: z.string().optional(),
  })
  .strict();
