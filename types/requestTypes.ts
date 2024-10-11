import { t } from "elysia";

import { FilterEnum } from "../enums/requestEnums";
import { AvailablePermissions } from "./entityTypes";

export type AfterHandlerActionType = "create" | "update" | "arkive" | "delete";

export type SearchableEntities =
  | "characters"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "nodes"
  | "edges"
  | "blueprints"
  | "blueprint_instances"
  | "random_tables"
  | "calendars"
  | "images"
  | "map_images"
  | "events"
  | "dictionaries"
  | "words"
  | "tags";
export type SearchableMentionEntities =
  | "characters"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "nodes"
  | "words";

type RequestFilterOperatorType = keyof typeof FilterEnum;

export interface RequestFilterType {
  id: string;
  field: string;
  value: string | number | string[] | number[] | boolean | boolean[] | null;
  header_name?: string | undefined;
  operator: RequestFilterOperatorType;
  relationalData?: {
    blueprint_field_id?: string;
    character_field_id?: string;
    label?: string;
  };
}

export interface RequestBodyFiltersType {
  and?: RequestFilterType[];
  or?: RequestFilterType[];
}
type SortType = "asc" | "desc";
export interface RequestOrderByType {
  field: string;
  sort: SortType;
}

const FilterEnumSchema = t.Union([
  t.Literal("eq"),
  t.Literal("neq"),
  t.Literal("gt"),
  t.Literal("gte"),
  t.Literal("lt"),
  t.Literal("lte"),
  t.Literal("ilike"),
  t.Literal("in"),
  t.Literal("is"),
  t.Literal("not in"),
  t.Literal("is not"),
]);

const RequestFilterSchema = t.Optional(
  t.Array(
    t.Object({
      id: t.String(),
      field: t.String(),
      value: t.Union([
        t.String(),
        t.Number(),
        t.Boolean(),
        t.Null(),
        t.Array(t.String()),
        t.Array(t.Number()),
        t.Array(t.Boolean()),
      ]),
      operator: FilterEnumSchema,
      header_name: t.Optional(t.String()),
      relationalData: t.Optional(
        t.Object({
          character_field_id: t.Optional(t.String()),
          blueprint_field_id: t.Optional(t.String()),
          label: t.Optional(t.String()),
        }),
      ),
    }),
  ),
);

export const RequestBodySchema = t.Object({
  fields: t.Array(t.String()),
  orderBy: t.Optional(t.Array(t.Object({ field: t.String(), sort: t.Union([t.Literal("asc"), t.Literal("desc")]) }))),
  pagination: t.Optional(
    t.Object({
      limit: t.Optional(t.Number({ default: 10 })),
      page: t.Optional(t.Number({ default: 0 })),
    }),
  ),
  filters: t.Optional(
    t.Object({
      and: RequestFilterSchema,
      or: RequestFilterSchema,
    }),
  ),
  relationFilters: t.Optional(
    t.Object({
      and: RequestFilterSchema,
      or: RequestFilterSchema,
    }),
  ),
  permissions: t.Optional(t.Boolean()),
  arkived: t.Optional(t.Boolean()),
});

export const ResponseSchema = t.Object({
  message: t.String(),
  ok: t.Boolean(),
  role_access: t.Boolean(),
});
export const GatewayResponseSchema = t.Object({
  message: t.String(),
  ok: t.Boolean(),
});
export const ResponseWithDataSchema = t.Object({
  data: t.Any(),
  message: t.String(),
  ok: t.Boolean(),
  role_access: t.Boolean(),
});

export const GatewayResponseWithDataSchema = t.Object({
  data: t.Any(),
  message: t.String(),
  ok: t.Boolean(),
});

export type PermissionDecorationType = {
  user_id: string;
  project_id: string | null;
  game_id?: string | null;
  is_project_owner: boolean;
  role_access: boolean;
  role_id: string | null;
  permission_id: string | null;
  all_permissions?: Record<AvailablePermissions, boolean>;
};

export type GamePermissionDecorationType = {
  user_id: string;
  game_id: string | null;
  is_game_owner: boolean;
};
