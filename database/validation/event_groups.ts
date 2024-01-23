import { t } from "elysia";

export const InsertEventGroupSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
  }),
});
export const UpdateEventGroupSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
  }),
});
export const ListEventGroupSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
  }),
});
export const ReadEventGroupSchema = t.Object({
  data: t.Object({
    id: t.String(),
  }),
});
