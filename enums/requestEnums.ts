import { ComparisonOperatorExpression } from "kysely";

export const FilterEnum: { [key: string]: ComparisonOperatorExpression } = {
  eq: "=",
  neq: "<>",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  ilike: "ilike",
  in: "in",
  is: "is",
  notIn: "not in",
};
