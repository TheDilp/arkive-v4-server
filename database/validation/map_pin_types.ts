import { t } from "elysia";

export const ReadMapPinTypeSchema = t.Object({
  data: t.Object({
    id: t.String(),
  }),
});

export const InsertMapPinTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
  }),
});

export const UpdateMapPinTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
  }),
});
