import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadProjectSchema = t.Intersect([RequestBodySchema]);

export const InsertProjectSchema = t.Object({
  data: t.Object({ owner_id: t.String(), title: t.String(), image: t.Optional(t.String()) }),
});

export const UpdateProjectSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    image_id: t.Optional(t.String()),
  }),
});

export const ProjectListSchema = t.Object({
  data: t.Object({
    owner_id: t.String(),
  }),
});
