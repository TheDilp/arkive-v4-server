import { t } from "elysia";

const NodeShapeEnum = t.Optional(
  t.Union([
    t.Literal("rectangle"),
    t.Literal("ellipse"),
    t.Literal("triangle"),
    t.Literal("barrel"),
    t.Literal("rhomboid"),
    t.Literal("diamond"),
    t.Literal("pentagon"),
    t.Literal("hexagon"),
    t.Literal("heptagon"),
    t.Literal("octagon"),
    t.Literal("star"),
    t.Literal("cut-rectangle"),
    t.Literal("round-triangle"),
    t.Literal("round-rectangle"),
    t.Literal("bottom-round-rectangle"),
    t.Literal("round-diamond"),
    t.Literal("round-pentagon"),
    t.Literal("round-hexagon"),
    t.Literal("round-heptagon"),
    t.Literal("round-octagon"),
    t.Null(),
  ]),
);

export const ReadNodeSchema = t.Object({
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Boolean()),
      image: t.Optional(t.Boolean()),
      character: t.Optional(t.Boolean()),
    }),
  ),
});

export const InsertNodeSchema = t.Object({
  data: t.Object({
    // IDs are required in order to insert nodes
    // on the frontend during mutation to provide for a
    // better UX
    id: t.String(),
    parent_id: t.String(),
    label: t.Optional(t.Union([t.String(), t.Null()])),
    type: NodeShapeEnum,
    width: t.Optional(t.Number()),
    height: t.Optional(t.Number()),
    x: t.Number(),
    y: t.Number(),
    font_size: t.Optional(t.Union([t.Number(), t.Null()])),
    font_color: t.Optional(t.Union([t.String(), t.Null()])),
    font_family: t.Optional(t.Union([t.String(), t.Null()])),
    text_v_align: t.Optional(t.Union([t.String(), t.Null()])),
    text_h_align: t.Optional(t.Union([t.String(), t.Null()])),
    background_color: t.Optional(t.Union([t.String(), t.Null()])),
    background_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
    is_template: t.Optional(t.Union([t.Boolean(), t.Null()])),
    z_index: t.Optional(t.Union([t.Number(), t.Null()])),
    doc_id: t.Optional(t.Union([t.String(), t.Null()])),
    character_id: t.Optional(t.Union([t.String(), t.Null()])),
    event_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateNodeSchema = t.Object({
  data: t.Object({
    id: t.String(),
    label: t.Optional(t.Union([t.String(), t.Null()])),
    type: NodeShapeEnum,
    width: t.Optional(t.Number()),
    height: t.Optional(t.Number()),
    x: t.Optional(t.Number()),
    y: t.Optional(t.Number()),
    font_size: t.Optional(t.Union([t.Number(), t.Null()])),
    font_color: t.Optional(t.Union([t.String(), t.Null()])),
    font_family: t.Optional(t.Union([t.String(), t.Null()])),
    text_v_align: t.Optional(t.Union([t.String(), t.Null()])),
    text_h_align: t.Optional(t.Union([t.String(), t.Null()])),
    background_color: t.Optional(t.Union([t.String(), t.Null()])),
    background_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
    is_template: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_locked: t.Optional(t.Union([t.Boolean(), t.Null()])),
    z_index: t.Optional(t.Union([t.Number(), t.Null()])),
    doc_id: t.Optional(t.Union([t.String(), t.Null()])),
    character_id: t.Optional(t.Union([t.String(), t.Null()])),
    event_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateManyNodesSchema = t.Object({ data: t.Array(UpdateNodeSchema) });

export const DeleteManyNodesSchema = t.Object({ data: t.Array(t.Object({ id: t.String() })) });
