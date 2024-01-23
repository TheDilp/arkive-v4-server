import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

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
export const ListEventGroupSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      project_id: t.String(),
    }),
  }),
]);
export const ReadEventGroupSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      id: t.String(),
    }),
  }),
]);
