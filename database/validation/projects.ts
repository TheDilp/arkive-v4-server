import { t } from "elysia";

export const InsertProjectSchema = t.Object({
  data: t.Object({ owner_id: t.String(), title: t.String(), image: t.Optional(t.String()) }),
});

export const UpdateProjectSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    image_id: t.Optional(t.String()),
  }),
});

export const ProjectistSchema = t.Object({
  data: t.Object({
    owner_id: t.String(),
  }),
});
