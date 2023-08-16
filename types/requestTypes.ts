import { FilterEnum } from "../enums/requestEnums";

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

export interface RequestBodyType {
  data?: any;
  fields: string[];
  orderBy?: RequestOrderByType[];
  pagination?: RequestPaginationType;
  relations?: {
    [key: string]:
      | boolean
      | {
          and?: RequestFilterType[];
          or?: RequestFilterType[];
        };
  };
  filters?: {
    and?: RequestFilterType[];
    or?: RequestFilterType[];
  };
}
