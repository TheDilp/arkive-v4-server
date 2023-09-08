import { Insertable, Updateable } from "kysely";
import { Events } from "kysely-codegen";
import { z } from "zod";

export type InsertEventType = Insertable<Events>;
export type UpdateEventType = Updateable<Events>;

export const InsertEventSchema = z.object({
  data: z.object({
    title: z.string(),
    parent_id: z.string(),
    description: z.string().optional().nullable(),
    is_public: z.boolean().optional().nullable(),
    background_color: z.string().optional().nullable(),
    text_color: z.string().optional().nullable(),
    start_day: z.number(),
    start_month: z.number(),
    start_year: z.number(),
    end_day: z.number().optional().nullable(),
    end_month: z.number().optional().nullable(),
    end_year: z.number().optional().nullable(),
    hours: z.number().optional().nullable(),
    minutes: z.number().optional().nullable(),

    document_id: z.string().optional().nullable(),
    image_id: z.string().optional().nullable(),
  }),
  relations: z
    .object({
      tags: z.object({ id: z.string() }).array().optional(),
    })
    .optional(),
});

export const UpdateEventSchema = z.object({
  data: z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    is_public: z.boolean().optional().nullable(),
    background_color: z.string().optional().nullable(),
    text_color: z.string().optional().nullable(),
    start_day: z.number().optional(),
    start_month: z.number().optional(),
    start_year: z.number().optional(),
    end_day: z.number().optional().nullable(),
    end_month: z.number().optional().nullable(),
    end_year: z.number().optional().nullable(),
    hours: z.number().optional().nullable(),
    minutes: z.number().optional().nullable(),

    document_id: z.string().optional().nullable(),
    image_id: z.string().optional().nullable(),
  }),
  relations: z
    .object({
      tags: z.object({ id: z.string() }).array().optional(),
    })
    .optional(),
});
