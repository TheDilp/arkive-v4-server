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

export interface RequestBodyType {
  data?: any;
  fields: string[];
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
