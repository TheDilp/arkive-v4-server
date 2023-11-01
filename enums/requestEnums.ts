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
  "is not": "is not",
  "not in": "not in",
};

export const MessageEnum = {
  success: "Success.",
  route_not_found: "Route not found.",
  successfully_created: "successfully created.",
  successfully_updated: "successfully updated.",
  successfully_deleted: "successfully deleted.",
};
