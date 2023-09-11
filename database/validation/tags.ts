import { t } from "elysia";
import { z } from "zod";
import { RequestBodySchema } from "../../types/requestTypes";

export const TagListSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ project_id: t.String() }) })]);

export const InsertTagSchema = t.Union([
  t.Object({
    title: t.String(),
    color: t.String(),
    project_id: t.String(),
  }),
  t.Array(
    t.Object({
      title: t.String(),
      color: t.String(),
      project_id: t.String(),
    }),
  ),
]);

export const UpdateTagSchema = t.Object({
  id: t.String(),
  title: t.Optional(t.String()),
  color: t.Optional(t.String()),
});
