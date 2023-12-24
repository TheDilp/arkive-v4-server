import { ExpressionWrapper, SelectQueryBuilder, SqlBool } from "kysely";
import { DB } from "kysely-codegen";

import { BlueprintInstanceRelationTables, DBKeys, TagsRelationTables } from "../database/types";
import { FilterEnum } from "../enums/requestEnums";
import { RequestBodyFiltersType } from "../types/requestTypes";
import { relatedEntityFromBPIRelationTable } from "./requestUtils";
import { GroupedQueryFilter, groupFiltersByField } from "./transform";

export function constructFilter(
  table: DBKeys,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: RequestBodyFiltersType | undefined,
) {
  return queryBuilder.where(({ eb, and, or }) => {
    const andFilters: ExpressionWrapper<DB, any, SqlBool>[] = [];
    const orFilters: ExpressionWrapper<DB, any, SqlBool>[] = [];
    const finalFilters = [];

    const groupedFilters = groupFiltersByField(filters || {});
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
  filters: GroupedQueryFilter[] | undefined,
) {
  let count = 0;
  const andInIds = (filters || [])
    .filter((filt) => filt.type === "AND")
    .map((filt) => {
      count += 1;
      return filt.value;
    });

  const orInIds = (filters || []).filter((filt) => filt.type === "OR").map((filt) => filt.value);

  if (andInIds.length > 0 || orInIds.length > 0)
    return queryBuilder
      .innerJoin(tagTable, `${table}.id`, `${tagTable}.A`)
      .innerJoin("tags", `${tagTable}.B`, "tags.id")
      .where(({ eb, and }) => {
        const andFilters = [];
        const finalFilters = [];
        if (andInIds.length) andFilters.push(eb("tags.id", "in", andInIds as string[]));

        if (orInIds.length) {
          count += 1;
          andFilters.push(
            eb.exists((ebb) =>
              ebb
                .selectFrom(tagTable)
                .whereRef(`${table}.id`, "=", `${tagTable}.A`)
                .innerJoin("tags", `${tagTable}.B`, "tags.id")
                .where("tags.id", "in", orInIds as string[])
                .having(({ fn }) => fn.count<number>("tags.id").distinct(), ">=", 1),
            ),
          );
        }

        if (andFilters?.length) finalFilters.push(and(andFilters));
        return and(finalFilters);
      })
      .$if(!!andInIds.length, (qb) => {
        qb = qb.groupBy([`${table}.id`]).having(({ fn }) => fn.count<number>("tags.id").distinct(), ">=", count);

        return qb;
      });
  return queryBuilder;
}
export function blueprintInstanceRelationFilter(
  blueprintInstanceRelationTable: BlueprintInstanceRelationTables,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: GroupedQueryFilter[] | undefined,
) {
  let count = 0;
  const andIds = (filters || [])
    .filter((filt) => filt.type === "AND")
    .map((filt) => {
      count += 1;
      return filt.value;
    });
  const orIds = (filters || []).filter((filt) => filt.type === "OR").map((filt) => filt.value);
  const relatedEntity = relatedEntityFromBPIRelationTable(blueprintInstanceRelationTable);
  if (relatedEntity)
    return queryBuilder
      .innerJoin(
        blueprintInstanceRelationTable,
        "blueprint_instances.id",
        `${blueprintInstanceRelationTable}.blueprint_instance_id`,
      )
      .innerJoin(relatedEntity, `${blueprintInstanceRelationTable}.related_id`, `${relatedEntity}.id`)
      .where(({ eb, and }) => {
        const andFilters = [];
        const finalFilters = [];

        if (andIds.length) andFilters.push(eb(`${relatedEntity}.id`, "in", andIds as string[]));
        if (orIds.length) {
          count += 1;

          andFilters.push(
            eb.exists((ebb) =>
              ebb
                .selectFrom(blueprintInstanceRelationTable)
                .whereRef("blueprint_instances.id", "=", `${blueprintInstanceRelationTable}.blueprint_instance_id`)
                .innerJoin(relatedEntity, `${blueprintInstanceRelationTable}.related_id`, `${relatedEntity}.id`)
                .where(`${relatedEntity}.id`, "in", orIds as string[])
                .having(({ fn }) => fn.count<number>("characters.id").distinct(), ">=", 1),
            ),
          );
        }

        if (andFilters?.length) finalFilters.push(and(andFilters));
        return and(finalFilters);
      })
      .$if(!!andIds.length, (qb) => {
        qb = qb
          .groupBy(["blueprint_instances.id"])
          .having(({ fn }) => fn.count<number>(`${relatedEntity}.id`).distinct(), ">=", count);

        return qb;
      });
  return queryBuilder;
}
