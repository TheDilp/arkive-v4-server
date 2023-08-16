import { SelectQueryBuilder } from "kysely";
import { DB } from "kysely-codegen";

import { RequestOrderByType } from "../types/requestTypes";

export function constructOrdering(orderBy: RequestOrderByType[] | undefined, qb: SelectQueryBuilder<DB, any, any>) {
  if (orderBy) {
    for (let index = 0; index < orderBy.length; index++) {
      const order = orderBy[index];
      qb = constructOrderBy(qb, order?.field as string, order?.sort);
    }
  }
  return qb;
}

export function constructOrderBy(queryBuilder: SelectQueryBuilder<DB, any, any>, field: string, sort?: "asc" | "desc") {
  return queryBuilder.orderBy(field, sort || "asc");
}
