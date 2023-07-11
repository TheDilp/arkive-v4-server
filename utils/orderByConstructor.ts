import { SelectQueryBuilder } from "kysely";
import { DB } from "kysely-codegen";

export function constructOrderBy(queryBuilder: SelectQueryBuilder<DB, any, any>, field: string, sort?: "asc" | "desc") {
  return queryBuilder.orderBy(field, sort || "asc");
}
