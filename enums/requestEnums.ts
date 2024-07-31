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
  successfully_arkived: "successfully arkived.",
  successfully_deleted: "successfully deleted.",
  error_image_upload: "There was an error uploading your image(s).",
  error_entity_not_public: "Access forbidden - this entity is not public.",
  gateway_access_code: "Incorrect access code.",
  gateway_verify: "Error verifying gateway access.",
};
