import { ComparisonOperatorExpression } from "kysely";

export const FilterEnum: { [key: string]: ComparisonOperatorExpression } = {
  eq: "=",
  neq: "<>",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  search: "ilike",
  in: "in",
  notIn: "not in",
};
