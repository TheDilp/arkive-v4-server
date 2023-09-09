import { Insertable, Updateable } from "kysely";
import { Months } from "kysely-codegen";
import { z } from "zod";

export type InsertMonthType = Insertable<Months>;
export type UpdateMonthType = Updateable<Months>;

export const InsertMonthSchema = z.object({
  title: z.string(),
  days: z.number(),
  sort: z.number(),
  // Optional because it's being attached to a calendar which will provide the parent_id
  parent_id: z.string().optional(),
});
export const UpdateMonthSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  days: z.number().optional(),
  sort: z.number().optional(),
});
