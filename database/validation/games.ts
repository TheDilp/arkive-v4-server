import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListGameSchema = t.Intersect([RequestBodySchema]);

export const ReadGameSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          game_players: t.Optional(t.Boolean()),
          project: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const AddToGameSchema = t.Object({
  data: t.Object({
    game_id: t.String(),
    related_id: t.String(),
    parent_id: t.Optional(t.String()),
  }),
});

export const UpdateGamePermissionsSchema = t.Object({
  data: t.Object({
    permission: t.Union([t.Literal("none"), t.Literal("view"), t.Literal("read"), t.Literal("own")]),
    related_id: t.String(),
    player_id: t.String(),
  }),
});
