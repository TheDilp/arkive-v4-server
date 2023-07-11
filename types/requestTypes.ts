import { FilterEnum } from "../enums/requestEnums";

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

export interface RequestBodyType {
  data?: any;
  fields: string[];
  orderBy?: RequestOrderByType;
  relations?: {
    [key: string]:
      | boolean
      | {
          [key: string]: any;
        };
  };
  filters?: {
    and?: RequestFilterType[];
    or?: RequestFilterType[];
  };
}
