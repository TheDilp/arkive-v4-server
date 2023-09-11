import { getSchemaValidator, t } from "elysia";
import { FilterEnum } from "../enums/requestEnums";
import { TSchema, TypeBuilder } from "@sinclair/typebox";

export type SearchableEntities =
  | "characters"
  | "documents"
  | "maps"
  | "map_pins"
  | "boards"
  | "nodes"
  | "edges"
  | "random_tables"
  | "images"
  | "tags";
export type SearchableMentionEntities = "characters" | "documents" | "maps" | "map_pins" | "boards" | "nodes" | "words";

export type RequestFilterOperatorType = keyof typeof FilterEnum;

export interface RequestFilterType {
  field: string;
  value: string | number;
  operator: RequestFilterOperatorType;
}

export interface RequestBodyFiltersType {
  and?: RequestFilterType[];
  or?: RequestFilterType[];
}
export type SortType = "asc" | "desc";
export interface RequestOrderByType {
  field: string;
  sort: SortType;
}

export interface RequestPaginationType {
  limit?: number;
  page?: number;
}

export interface RequestBodyType<T extends { data: any; relations: any }> {
  data?: T["data"];
  fields: string[];
  orderBy?: RequestOrderByType[];
  pagination?: RequestPaginationType;
  relations?: T["relations"];
  filters?: {
    and?: RequestFilterType[];
    or?: RequestFilterType[];
  };
  relationFilters?: Record<string, string[]>;
}
export const RequestBodySchema = t.Object({
  fields: t.Optional(t.Array(t.String())),
  orderBy: t.Optional(t.Array(t.Object({ field: t.String(), sort: t.Union([t.Literal("asc"), t.Literal("desc")]) }))),
  pagination: t.Optional(
    t.Object({
      limit: t.Optional(t.Number({ default: 10 })),
      page: t.Optional(t.Number({ default: 0 })),
    }),
  ),
  filters: t.Optional(
    t.Object({
      and: t.Optional(
        t.Array(
          t.Object({
            field: t.String(),
            value: t.Union([t.String(), t.Number()]),
            operator: t.Union([t.Literal("eq"), t.Literal("neq"), t.Literal("gt")]),
          }),
        ),
      ),
      or: t.Optional(
        t.Array(
          t.Object({
            field: t.String(),
            value: t.Union([t.String(), t.Number()]),
            operator: t.Union([t.Literal("eq"), t.Literal("neq"), t.Literal("gt")]),
          }),
        ),
      ),
    }),
  ),
  relationFilters: t.Optional(t.Record(t.String(), t.Array(t.String()))),
});

export const ResponseSchema = t.Object({ message: t.String(), ok: t.Boolean() });
export const ResponseWithDataSchema = t.Object({ data: t.Any(), message: t.String(), ok: t.Boolean() });
