import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";
import { InsertRandomTableOptionItemSchema } from ".";

export const ReadRandomTableSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({}) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          random_table_options: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertRandomTableSchema = t.Object({
  data: t.Object({
    title: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    project_id: t.String(),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
  relations: t.Object({
    random_table_options: t.Array(t.Object({ data: InsertRandomTableOptionItemSchema })),
  }),
});
export const UpdateRandomTableSchema = t.Object({
  data: t.Object({
    title: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    project_id: t.String(),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
});
