import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListMapPinTypeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      project_id: t.String(),
    }),
  }),
]);

export const InsertMapPinTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    default_icon: t.Optional(t.String()),
    default_icon_color: t.Optional(t.String()),
  }),
});

export const UpdateMapPinTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
    default_icon: t.Optional(t.String()),
    owner_id: t.Optional(t.String()),
    default_icon_color: t.Optional(t.String()),
  }),
});
