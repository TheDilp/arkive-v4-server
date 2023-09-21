import { t } from "elysia";

export const UpdateImageSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
  }),
});
