import { ExpressionBuilder, SelectQueryBuilder } from "kysely";
import { DB } from "kysely-codegen";

import { DBKeys, TagsRelationTables } from "../database/types";
import { FilterEnum } from "../enums/requestEnums";
import { RequestBodyFiltersType } from "../types/requestTypes";

export function constructFilter(
  table: DBKeys,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: RequestBodyFiltersType | undefined,
) {
  return queryBuilder.where(({ eb, and, or }) => {
    const andFilters = [];
    const orFilters = [];
    const finalFilters = [];
    if (filters?.and?.length) {
      const { and } = filters;
      for (let index = 0; index < and.length; index++) {
        const { field, operator, value } = and[index];
        const dbOperator = FilterEnum[operator];
        // @ts-ignore
        andFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
      }
    }
    if (filters?.or?.length) {
      const { or } = filters;

      for (let index = 0; index < or.length; index++) {
        const { field, operator, value } = or[index];
        const dbOperator = FilterEnum[operator];
        // @ts-ignore
        orFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
      }
    }

    if (andFilters?.length) finalFilters.push(and(andFilters));
    if (orFilters?.length) finalFilters.push(or(orFilters));
    return and(finalFilters);
  });
}

export function constructTagFilter(
  table: DBKeys,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  relation_table: TagsRelationTables,
  tagIds: string[],
  relationColumn: "A" | "B",
  tagColumn: "A" | "B",
) {
  return (
    queryBuilder
      .leftJoin(`${relation_table} as tagRelationTable`, `tagRelationTable.${relationColumn}`, `${table}.id`)
      .select([`tagRelationTable.${relationColumn}`, `tagRelationTable.${tagColumn}`])
      // @ts-ignore
      .where(`tagRelationTable.${tagColumn}`, "in", tagIds)
  );
}

export function relationConstructor(
  table: DBKeys,
  expressionBuilder: ExpressionBuilder<DB, any>,
  filters: RequestBodyFiltersType | undefined,
  fields: string[],
) {
  return expressionBuilder
    .selectFrom(table)
    .select(fields || ["id"])
    .where(({ eb, and, or }) => {
      const andFilters = [];
      const orFilters = [];
      const finalFilters = [];
      if (filters?.and?.length) {
        for (let index = 0; index < filters.and.length; index++) {
          const { field, operator, value } = filters.and[index];
          const dbOperator = FilterEnum[operator];
          // @ts-ignore
          andFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
        }
      }
      if (filters?.or?.length) {
        for (let index = 0; index < filters.or.length; index++) {
          const { field, operator, value } = filters.or[index];
          const dbOperator = FilterEnum[operator];
          // @ts-ignore
          orFilters.push(eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${value}%` : value));
        }
      }

      if (andFilters?.length) finalFilters.push(and(andFilters));
      if (orFilters?.length) finalFilters.push(or(orFilters));
      return and(finalFilters);
    });
}
