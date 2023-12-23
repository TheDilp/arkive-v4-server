import { ExpressionWrapper, SelectQueryBuilder, SqlBool } from "kysely";
import { DB } from "kysely-codegen";

import { DBKeys, TagsRelationTables } from "../database/types";
import { FilterEnum } from "../enums/requestEnums";
import { RequestBodyFiltersType, RequestFilterType } from "../types/requestTypes";

interface GroupedQueries {
  [key: string]: {
    filters: (RequestFilterType & { type: "AND" | "OR" })[];
  };
}

export function constructFilter(
  table: DBKeys,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: RequestBodyFiltersType | undefined,
) {
  return queryBuilder.where(({ eb, and, or }) => {
    const andFilters: ExpressionWrapper<DB, any, SqlBool>[] = [];
    const orFilters: ExpressionWrapper<DB, any, SqlBool>[] = [];
    const finalFilters = [];

    const groupedFilters = groupByField(filters || {});
    Object.entries(groupedFilters).forEach(([field, { filters }]) => {
      filters.forEach((filter) => {
        const dbOperator = FilterEnum[filter.operator];
        if (filter.type === "AND")
          andFilters.push(
            eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${filter.value}%` : (filter.value as any)),
          );
        if (filter.type === "OR")
          orFilters.push(
            eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${filter.value}%` : (filter.value as any)),
          );
      });
    });

    // if (filters?.and?.length) {
    //   const { and } = filters;
    //   for (let index = 0; index < and.length; index++) {
    //     const { field, operator, value } = and[index];
    //     const dbOperator = FilterEnum[operator];
    //     // @ts-ignore
    //     andFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
    //   }
    // }
    // if (filters?.or?.length) {
    //   const { or } = filters;

    //   for (let index = 0; index < or.length; index++) {
    //     const { field, operator, value } = or[index];
    //     const dbOperator = FilterEnum[operator];
    //     // @ts-ignore
    //     orFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
    //   }
    // }

    if (andFilters?.length) finalFilters.push(and(andFilters));
    if (orFilters?.length) finalFilters.push(or(orFilters));
    return and(finalFilters);
  });
}

export function tagsRelationFilter(
  table: DBKeys,
  tagTable: TagsRelationTables,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: RequestBodyFiltersType | undefined,
) {
  let count = 0;
  return queryBuilder
    .innerJoin(tagTable, `${table}.id`, `${tagTable}.A`)
    .innerJoin("tags", `${tagTable}.B`, "tags.id")
    .where(({ eb, and }) => {
      const andFilters = [];
      const finalFilters = [];
      if (filters?.and?.length) {
        count += filters.and.length;
        const andIds = filters.and.flatMap((filt) => filt.value);
        andFilters.push(eb("tags.id", "in", andIds as string[]));
      }
      if (filters?.or?.length) {
        count += 1;
        const orIds = filters.or.flatMap((filt) => filt.value);
        andFilters.push(
          eb.exists((ebb) =>
            ebb
              .selectFrom(tagTable)
              .whereRef(`${table}.id`, "=", `${tagTable}.A`)
              .innerJoin("tags", `${tagTable}.B`, "tags.id")
              .where("tags.id", "in", orIds as string[])
              .having(({ fn }) => fn.count<number>("tags.id").distinct(), ">=", 1),
          ),
        );
      }

      if (andFilters?.length) finalFilters.push(and(andFilters));
      return and(finalFilters);
    })
    .$if(!filters?.or?.length, (qb) => {
      qb = qb.groupBy([`${table}.id`]).having(({ fn }) => fn.count<number>("tags.id").distinct(), ">=", count);

      return qb;
    });
}

function groupByField(queryStructure: RequestBodyFiltersType): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }
        const newFilter = rest;
        newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
        groupedQueries[field].filters.push(newFilter);
      }
    }
  }

  return groupedQueries;
}
