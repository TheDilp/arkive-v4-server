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
