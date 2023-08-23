import { Insertable, Updateable } from "kysely";
import { MapPins } from "kysely-codegen";
import { z } from "zod";

export type InsertMapPinType = Insertable<MapPins>;
export type UpdateMapPinType = Updateable<MapPins>;

export const InsertMapPinSchema = z.object({
  parent_id: z.string(),
  lat: z.number(),
  lng: z.number(),
  title: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  border_color: z.string().nullable().optional(),
  background_color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  show_background: z.boolean().optional(),
  show_border: z.boolean().optional(),
  is_public: z.boolean().nullable().optional(),
  map_link: z.string().nullable().optional(),
  doc_id: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});
export const UpdateMapPinSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  title: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  border_color: z.string().nullable().optional(),
  background_color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  show_background: z.boolean().optional(),
  show_border: z.boolean().optional(),
  is_public: z.boolean().nullable().optional(),
  map_link: z.string().nullable().optional(),
  doc_id: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});
