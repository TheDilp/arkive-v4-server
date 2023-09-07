import { Insertable, Updateable } from "kysely";
import { Calendars } from "kysely-codegen";
import { z } from "zod";

import { InsertMonthSchema, UpdateMonthSchema } from "./months";

export type InsertCalendarType = Insertable<Calendars>;
export type UpdateCalendarType = Updateable<Calendars>;

export const InsertCalendarSchema = z.object({
  data: z.object({
    title: z.string(),
    is_folder: z.boolean().nullable().optional(),
    is_public: z.boolean().nullable().optional(),
    icon: z.string().nullable().optional(),
    project_id: z.string(),
    offset: z.number(),
    hours: z.number().optional().nullable(),
    minutes: z.number().optional().nullable(),
    parent_id: z.string().nullable().optional(),
    days: z.string().array().min(1),
  }),
  relations: z.object({
    months: InsertMonthSchema.array().min(1),
  }),
});

export const UpdateCalendarSchema = z.object({
  data: z.object({
    id: z.string(),
    title: z.string().optional(),
    is_folder: z.boolean().nullable().optional(),
    is_public: z.boolean().nullable().optional(),
    icon: z.string().nullable().optional(),
    parent_id: z.string().nullable().optional(),
    days: z.string().array().min(1).optional(),
  }),
  relations: z.object({
    months: InsertMonthSchema.array().min(1).or(UpdateMonthSchema.array().min(1)),
  }),
});
