import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const InsertGatewayConfiguration = t.Object({
  data: t.Object({
    title: t.String(),
    gateway_type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
    project_id: t.String(),
  }),
  relations: t.Object({
    characters: t.Array(t.String()),
    blueprint_instances: t.Array(t.String()),
    documents: t.Array(t.String()),
    maps: t.Array(t.String()),
    map_pins: t.Array(t.String()),
    events: t.Array(t.String()),
    images: t.Array(t.String()),
    random_tables: t.Array(t.String()),
  }),
});

export const UpdateGatewayConfiguration = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
  }),
  relations: t.Object({
    characters: t.Array(t.String()),
    blueprint_instances: t.Array(t.String()),
    documents: t.Array(t.String()),
    maps: t.Array(t.String()),
    map_pins: t.Array(t.String()),
    events: t.Array(t.String()),
    images: t.Array(t.String()),
    random_tables: t.Array(t.String()),
  }),
});

export const ListGatewayConfigurationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ entities: t.Optional(t.Boolean()) })),
  }),
]);

export const ReadGatewayConfigurationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(t.Object({ entities: t.Optional(t.Boolean()) })),
  }),
]);
