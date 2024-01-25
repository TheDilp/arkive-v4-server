import { ExpressionWrapper, SelectQueryBuilder, sql, SqlBool } from "kysely";
import { DB } from "kysely-codegen";

import {
  BlueprintInstanceRelationTables,
  CharacterRelationTables,
  DBKeys,
  EventRelationTables,
  TagsRelationTables,
} from "../database/types";
import { FilterEnum } from "../enums/requestEnums";
import { RequestBodyFiltersType } from "../types/requestTypes";
import {
  relatedEntityFromBPIRelationTable,
  relatedEntityFromCharacterRelationTable,
  relatedEntityFromEventRelationTable,
} from "./requestUtils";
import { groupByBlueprintFieldId, groupByCharacterFieldId, GroupedQueryFilter, groupFiltersByField } from "./transform";

function getBPValue(value: string | number | boolean | null) {
  if (typeof value === "string") return sql<string>`REPLACE(blueprint_instance_value.value::TEXT, '"', '')`;
  if (typeof value === "number")
    return sql<number>`
      CASE
      WHEN jsonb_typeof(blueprint_instance_value.value) = 'number' THEN blueprint_instance_value.value::INT
      ELSE NULL 
      END `;
  if (typeof value === "boolean")
    return sql<number>`CASE
      WHEN jsonb_typeof(blueprint_instance_value.value) = 'boolean' THEN blueprint_instance_value.value::BOOLEAN
      ELSE NULL
      END`;
  if (value === null) return sql`NULL`;

  return sql`NULL`;
}
function getCharacterValue(value: string | number | boolean | null) {
  if (typeof value === "string") return sql<string>`REPLACE(character_value_fields.value::TEXT, '"', '')`;
  if (typeof value === "number")
    return sql<number>`
      CASE
      WHEN jsonb_typeof(character_value_fields.value) = 'number' THEN character_value_fields.value::INT
      ELSE NULL 
      END `;
  if (typeof value === "boolean")
    return sql<number>`CASE
      WHEN jsonb_typeof(character_value_fields.value) = 'boolean' THEN character_value_fields.value::BOOLEAN
      ELSE NULL
      END`;
  if (value === null) return sql`NULL`;

  return sql`NULL`;
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

    const groupedFilters = groupFiltersByField(filters || {});
    const allFilters = Object.entries(groupedFilters);
    allFilters.forEach(([field, { filters }]) => {
      if (field === "is_public" || field === "is_favorite") {
        const specialFilters: any[] = [];
        filters.forEach((filter) => {
          const dbOperator = FilterEnum[filter.operator];
          specialFilters.push(
            eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${filter.value}%` : (filter.value as any)),
          );
        });

        if (specialFilters.length) {
          andFilters.push(eb.or(specialFilters));
        }
      } else {
        filters.forEach((filter) => {
          const dbOperator = FilterEnum[filter.operator];
          (filter.type === "AND" ? andFilters : orFilters).push(
            eb(`${table}.${field}`, dbOperator, dbOperator === "ilike" ? `%${filter.value}%` : (filter.value as any)),
          );
        });
      }
    });

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
  const andInIds =
    (filters || [])
      ?.filter((filt) => filt.type === "AND")
      ?.map((filt) => {
        count += 1;
        return filt.value;
      }) || [];

  const orInIds = (filters || [])?.filter((filt) => filt.type === "OR")?.map((filt) => filt.value) || [];

  if (andInIds.length > 0 || orInIds.length > 0)
    return queryBuilder
      .innerJoin(tagTable, `${table}.id`, `${tagTable}.A`)
      .innerJoin("tags", `${tagTable}.B`, "tags.id")
      .where(({ eb, and }) => {
        const andFilters = [];
        const finalFilters = [];
        if (andInIds.length) andFilters.push(eb("tags.id", "in", andInIds as string[]));

        if (orInIds.length) {
          // count += 1;
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
// #region blueprintFilters
export function blueprintInstanceRelationFilter(
  blueprintInstanceRelationTable: BlueprintInstanceRelationTables,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: GroupedQueryFilter[],
) {
  let count = 0;
  const andRequestFilters = (filters || []).filter((filt) => filt.type === "AND");
  count += andRequestFilters.length;

  const orRequestFilters = (filters || []).filter((filt) => filt.type === "OR");

  const relatedEntity = relatedEntityFromBPIRelationTable(blueprintInstanceRelationTable);
  if (relatedEntity)
    return queryBuilder
      .innerJoin(
        blueprintInstanceRelationTable,
        "blueprint_instances.id",
        `${blueprintInstanceRelationTable}.blueprint_instance_id`,
      )
      .innerJoin(relatedEntity, `${blueprintInstanceRelationTable}.related_id`, `${relatedEntity}.id`)
      .where(({ and, exists, selectFrom }) => {
        const andFilters = [];
        const orFilters = [];
        const finalFilters = [];
        const groupedAndByBPField = groupByBlueprintFieldId(andRequestFilters);
        const groupedOrByBPField = groupByBlueprintFieldId(orRequestFilters);

        let whereAndQuery: any;
        let whereOrQuery: any;
        if (andRequestFilters.length) {
          Object.entries(groupedAndByBPField).forEach(([blueprint_field_id, filters], index) => {
            const entityIds = filters.map((filt) => filt?.value as string);
            if (index === 0) {
              whereAndQuery = selectFrom(blueprintInstanceRelationTable)
                // @ts-ignore
                .select(sql<number>`1`)
                .innerJoin(relatedEntity, `${relatedEntity}.id`, `${blueprintInstanceRelationTable}.related_id`)
                .where(`${blueprintInstanceRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
                .where(`${relatedEntity}.id`, "in", entityIds)
                .whereRef(`${blueprintInstanceRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id");
            } else {
              whereAndQuery = whereAndQuery.intersect(
                selectFrom(blueprintInstanceRelationTable)
                  // @ts-ignore
                  .select(sql<number>`1`)
                  .innerJoin(relatedEntity, `${relatedEntity}.id`, `${blueprintInstanceRelationTable}.related_id`)
                  .where(`${blueprintInstanceRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
                  .where(`${relatedEntity}.id`, "in", entityIds)
                  .whereRef(`${blueprintInstanceRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id"),
              );
            }
          });

          andFilters.push(exists(whereAndQuery));
        }
        if (orRequestFilters.length) {
          count += 1;

          Object.entries(groupedOrByBPField).forEach(([blueprint_field_id, filters], index) => {
            const entityIds = filters.map((filt) => filt?.value as string);
            if (index === 0) {
              whereOrQuery = selectFrom(blueprintInstanceRelationTable)
                // @ts-ignore
                .select(sql<number>`1`)
                .innerJoin(relatedEntity, `${relatedEntity}.id`, `${blueprintInstanceRelationTable}.related_id`)
                .where(`${blueprintInstanceRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
                .where(`${relatedEntity}.id`, "in", entityIds)
                .whereRef(`${blueprintInstanceRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id");
            } else {
              whereOrQuery = whereOrQuery.union(
                selectFrom(blueprintInstanceRelationTable)
                  // @ts-ignore
                  .select(sql<number>`1`)
                  .innerJoin(relatedEntity, `${relatedEntity}.id`, `${blueprintInstanceRelationTable}.related_id`)
                  .where(`${blueprintInstanceRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
                  .where(`${relatedEntity}.id`, "in", entityIds)
                  .whereRef(`${blueprintInstanceRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id"),
              );
            }
          });

          orFilters.push(exists(whereOrQuery));
        }
        if (andFilters?.length) finalFilters.push(and(andFilters));
        if (orFilters?.length) finalFilters.push(and(orFilters));
        return and(finalFilters);
      })
      .$if(!!andRequestFilters.length || !!orRequestFilters.length, (qb) => {
        qb = qb
          .groupBy(["blueprint_instances.id"])
          .having(({ fn }) => fn.count<number>(`${relatedEntity}.id`).distinct(), ">=", count);

        return qb;
      });
  return queryBuilder;
}
export function blueprintInstanceValueFilter(queryBuilder: SelectQueryBuilder<DB, any, any>, filters: GroupedQueryFilter[]) {
  // let count = 0;
  const andRequestFilters = (filters || []).filter((filt) => filt.type === "AND");
  // count += andRequestFilters.length;

  const orRequestFilters = (filters || []).filter((filt) => filt.type === "OR");
  if (!andRequestFilters?.length && !orRequestFilters?.length) return queryBuilder;
  return queryBuilder.where(({ and, exists, selectFrom }) => {
    const andFilters = [];
    const orFilters = [];
    const finalFilters: any = [];

    let whereAndQuery: any;
    let whereOrQuery: any;
    if (andRequestFilters.length) {
      andRequestFilters.forEach((filt, index) => {
        if (index === 0) {
          whereAndQuery = selectFrom("blueprint_instance_value")
            // @ts-ignore
            .select(sql<number>`1`)
            .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
            .where("blueprint_instance_value.blueprint_field_id", "=", filt.relationalData?.blueprint_field_id as string)
            .where(
              getBPValue(filt.value as string | number | boolean | null),
              FilterEnum[filt.operator],
              filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
            );
        } else {
          whereAndQuery = whereAndQuery.intersect(
            selectFrom("blueprint_instance_value")
              // @ts-ignore
              .select(sql<number>`1`)
              .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
              .where("blueprint_instance_value.blueprint_field_id", "=", filt.relationalData?.blueprint_field_id as string)
              .where(
                getBPValue(filt.value as string | number | boolean | null),
                FilterEnum[filt.operator],
                filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
              ),
          );
        }
      });
      andFilters.push(exists(whereAndQuery));
    }

    if (orRequestFilters.length) {
      // count += 1;

      orRequestFilters.forEach((filt, index) => {
        if (index === 0) {
          whereOrQuery = selectFrom("blueprint_instance_value")
            // @ts-ignore
            .select(sql<number>`1`)
            .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
            .where("blueprint_instance_value.blueprint_field_id", "=", filt.relationalData?.blueprint_field_id as string)
            .where(
              getBPValue(filt.value as string | number | boolean | null),
              FilterEnum[filt.operator],
              filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
            );
        } else {
          whereOrQuery = whereOrQuery.union(
            selectFrom("blueprint_instance_value")
              // @ts-ignore
              .select(sql<number>`1`)
              .whereRef("blueprint_instance_value.blueprint_instance_id", "=", "blueprint_instances.id")
              .where("blueprint_instance_value.blueprint_field_id", "=", filt.relationalData?.blueprint_field_id as string)
              .where(
                getBPValue(filt.value as string | number | boolean | null),
                FilterEnum[filt.operator],
                filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
              ),
          );
        }
      });
      orFilters.push(exists(whereOrQuery));
    }
    if (andFilters?.length) finalFilters.push(and(andFilters));
    if (orFilters?.length) finalFilters.push(and(orFilters));
    return and(finalFilters);
  });
}
// #endregion blueprintFilters
// #region characterFilters
export function characterRelationFilter(
  characterRelationTable: CharacterRelationTables,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: GroupedQueryFilter[],
) {
  let count = 0;
  const andRequestFilters = (filters || []).filter((filt) => filt.type === "AND");
  count += andRequestFilters.length;

  const orRequestFilters = (filters || []).filter((filt) => filt.type === "OR");

  const relatedEntity = relatedEntityFromCharacterRelationTable(characterRelationTable);
  if (relatedEntity)
    return queryBuilder
      .innerJoin(characterRelationTable, "characters.id", `${characterRelationTable}.character_id`)
      .innerJoin(relatedEntity, `${characterRelationTable}.related_id`, `${relatedEntity}.id`)
      .where(({ and, exists, selectFrom }) => {
        const andFilters = [];
        const orFilters = [];
        const finalFilters = [];
        const groupedAndByBPField = groupByCharacterFieldId(andRequestFilters);
        const groupedOrByBPField = groupByCharacterFieldId(orRequestFilters);

        let whereAndQuery: any;
        let whereOrQuery: any;
        if (andRequestFilters.length) {
          Object.entries(groupedAndByBPField).forEach(([character_field_id, filters], index) => {
            const entityIds = filters.map((filt) => filt?.value as string);
            if (index === 0) {
              whereAndQuery = selectFrom(characterRelationTable)
                // @ts-ignore
                .select(sql<number>`1`)
                .innerJoin(relatedEntity, `${relatedEntity}.id`, `${characterRelationTable}.related_id`)
                .where(`${characterRelationTable}.character_field_id`, "=", character_field_id)
                .where(`${relatedEntity}.id`, "in", entityIds)
                .whereRef(`${characterRelationTable}.character_id`, "=", "characters.id");
            } else {
              whereAndQuery = whereAndQuery.intersect(
                selectFrom(characterRelationTable)
                  // @ts-ignore
                  .select(sql<number>`1`)
                  .innerJoin(relatedEntity, `${relatedEntity}.id`, `${characterRelationTable}.related_id`)
                  .where(`${characterRelationTable}.character_field_id`, "=", character_field_id)
                  .where(`${relatedEntity}.id`, "in", entityIds)
                  .whereRef(`${characterRelationTable}.character_id`, "=", "characters.id"),
              );
            }
          });

          andFilters.push(exists(whereAndQuery));
        }
        if (orRequestFilters.length) {
          count += 1;

          Object.entries(groupedOrByBPField).forEach(([character_field_id, filters], index) => {
            const entityIds = filters.map((filt) => filt?.value as string);
            if (index === 0) {
              whereOrQuery = selectFrom(characterRelationTable)
                // @ts-ignore
                .select(sql<number>`1`)
                .innerJoin(relatedEntity, `${relatedEntity}.id`, `${characterRelationTable}.related_id`)
                .where(`${characterRelationTable}.character_field_id`, "=", character_field_id)
                .where(`${relatedEntity}.id`, "in", entityIds)
                .whereRef(`${characterRelationTable}.character_id`, "=", "characters.id");
            } else {
              whereOrQuery = whereOrQuery.union(
                selectFrom(characterRelationTable)
                  // @ts-ignore
                  .select(sql<number>`1`)
                  .innerJoin(relatedEntity, `${relatedEntity}.id`, `${characterRelationTable}.related_id`)
                  .where(`${characterRelationTable}.character_field_id`, "=", character_field_id)
                  .where(`${relatedEntity}.id`, "in", entityIds)
                  .whereRef(`${characterRelationTable}.character_id`, "=", "characters.id"),
              );
            }
          });

          orFilters.push(exists(whereOrQuery));
        }
        if (andFilters?.length) finalFilters.push(and(andFilters));
        if (orFilters?.length) finalFilters.push(and(orFilters));
        return and(finalFilters);
      })
      .$if(!!andRequestFilters.length || !!orRequestFilters.length, (qb) => {
        qb = qb.groupBy(["characters.id"]).having(({ fn }) => fn.count<number>(`${relatedEntity}.id`).distinct(), ">=", count);

        return qb;
      });
  return queryBuilder;
}
export function characterValueFilter(queryBuilder: SelectQueryBuilder<DB, any, any>, filters: GroupedQueryFilter[]) {
  // let count = 0;
  const andRequestFilters = (filters || []).filter((filt) => filt.type === "AND");
  // count += andRequestFilters.length;

  const orRequestFilters = (filters || []).filter((filt) => filt.type === "OR");
  if (!andRequestFilters?.length && !orRequestFilters?.length) return queryBuilder;
  return queryBuilder.where(({ and, exists, selectFrom }) => {
    const andFilters = [];
    const orFilters = [];
    const finalFilters: any = [];

    let whereAndQuery: any;
    let whereOrQuery: any;
    if (andRequestFilters.length) {
      andRequestFilters.forEach((filt, index) => {
        if (index === 0) {
          whereAndQuery = selectFrom("character_value_fields")
            // @ts-ignore
            .select(sql<number>`1`)
            .whereRef("character_value_fields.character_id", "=", "characters.id")
            .where("character_value_fields.character_field_id", "=", filt.relationalData?.character_field_id as string)
            .where(
              getCharacterValue(filt.value as string | number | boolean | null),
              FilterEnum[filt.operator],
              filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
            );
        } else {
          whereAndQuery = whereAndQuery.intersect(
            selectFrom("character_value_fields")
              // @ts-ignore
              .select(sql<number>`1`)
              .whereRef("character_value_fields.character_id", "=", "characters.id")
              .where("character_value_fields.character_field_id", "=", filt.relationalData?.character_field_id as string)
              .where(
                getCharacterValue(filt.value as string | number | boolean | null),
                FilterEnum[filt.operator],
                filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
              ),
          );
        }
      });
      andFilters.push(exists(whereAndQuery));
    }

    if (orRequestFilters.length) {
      // count += 1;

      orRequestFilters.forEach((filt, index) => {
        if (index === 0) {
          whereOrQuery = selectFrom("character_value_fields")
            // @ts-ignore
            .select(sql<number>`1`)
            .whereRef("character_value_fields.character_id", "=", "characters.id")
            .where("character_value_fields.character_field_id", "=", filt.relationalData?.character_field_id as string)
            .where(
              getCharacterValue(filt.value as string | number | boolean | null),
              FilterEnum[filt.operator],
              filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
            );
        } else {
          whereOrQuery = whereOrQuery.union(
            selectFrom("character_value_fields")
              // @ts-ignore
              .select(sql<number>`1`)
              .whereRef("character_value_fields.character_id", "=", "characters.id")
              .where("character_value_fields.character_field_id", "=", filt.relationalData?.character_field_id as string)
              .where(
                getCharacterValue(filt.value as string | number | boolean | null),
                FilterEnum[filt.operator],
                filt.operator === "ilike" ? `%${filt.value}%` : filt.value,
              ),
          );
        }
      });
      orFilters.push(exists(whereOrQuery));
    }
    if (andFilters?.length) finalFilters.push(and(andFilters));
    if (orFilters?.length) finalFilters.push(and(orFilters));
    return and(finalFilters);
  });
}
// #endregion characterFilters

// #region eventFilters
export function eventRelationFilters(
  eventRelationTable: EventRelationTables,
  queryBuilder: SelectQueryBuilder<DB, any, any>,
  filters: GroupedQueryFilter[],
) {
  let count = 0;
  const andRequestFilters = (filters || []).filter((filt) => filt.type === "AND");
  count += andRequestFilters.length;

  const orRequestFilters = (filters || []).filter((filt) => filt.type === "OR");

  const relatedEntity = relatedEntityFromEventRelationTable(eventRelationTable);

  if (relatedEntity)
    return queryBuilder
      .innerJoin(eventRelationTable, "events.id", `${eventRelationTable}.event_id`)
      .innerJoin(relatedEntity, `${eventRelationTable}.related_id`, `${relatedEntity}.id`)
      .where(({ and, exists, selectFrom }) => {
        const andFilters = [];
        const orFilters = [];
        const finalFilters = [];
        const groupedAndByBPField = groupByBlueprintFieldId(andRequestFilters);
        const groupedOrByBPField = groupByBlueprintFieldId(orRequestFilters);

        console.log(andRequestFilters);

        let whereAndQuery: any;
        let whereOrQuery: any;
        if (andRequestFilters.length) {
          andRequestFilters.forEach((filt, index) => {
            const entityIds = filters.map((filt) => filt?.value as string);
            if (index === 0) {
              console.log(relatedEntity, eventRelationTable, filters, entityIds);
              whereAndQuery = selectFrom(eventRelationTable)
                // @ts-ignore
                .select(sql<number>`1`)
                .innerJoin(relatedEntity, `${relatedEntity}.id`, `${eventRelationTable}.related_id`)
                .where(`${relatedEntity}.id`, "in", entityIds)
                .whereRef(`${eventRelationTable}.event_id`, "=", "events.id");
            } else {
              whereAndQuery = whereAndQuery.intersect(
                selectFrom(eventRelationTable)
                  // @ts-ignore
                  .select(sql<number>`1`)
                  .innerJoin(relatedEntity, `${relatedEntity}.id`, `${eventRelationTable}.related_id`)
                  .where(`${relatedEntity}.id`, "in", entityIds)
                  .whereRef(`${eventRelationTable}.event_id`, "=", "events.id"),
              );
            }
          });

          andFilters.push(exists(whereAndQuery));
        }
        // if (orRequestFilters.length) {
        //   count += 1;

        //   Object.entries(groupedOrByBPField).forEach(([blueprint_field_id, filters], index) => {
        //     const entityIds = filters.map((filt) => filt?.value as string);
        //     if (index === 0) {
        //       whereOrQuery = selectFrom(eventRelationTable)
        //         // @ts-ignore
        //         .select(sql<number>`1`)
        //         .innerJoin(relatedEntity, `${relatedEntity}.id`, `${eventRelationTable}.related_id`)
        //         .where(`${eventRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
        //         .where(`${relatedEntity}.id`, "in", entityIds)
        //         .whereRef(`${eventRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id");
        //     } else {
        //       whereOrQuery = whereOrQuery.union(
        //         selectFrom(eventRelationTable)
        //           // @ts-ignore
        //           .select(sql<number>`1`)
        //           .innerJoin(relatedEntity, `${relatedEntity}.id`, `${eventRelationTable}.related_id`)
        //           .where(`${eventRelationTable}.blueprint_field_id`, "=", blueprint_field_id)
        //           .where(`${relatedEntity}.id`, "in", entityIds)
        //           .whereRef(`${eventRelationTable}.blueprint_instance_id`, "=", "blueprint_instances.id"),
        //       );
        //     }
        //   });

        //   orFilters.push(exists(whereOrQuery));
        // }
        if (andFilters?.length) finalFilters.push(and(andFilters));
        // if (orFilters?.length) finalFilters.push(and(orFilters));
        return and(finalFilters);
      })
      .$if(!!andRequestFilters.length || !!orRequestFilters.length, (qb) => {
        qb = qb
          .groupBy(["events.id", "sm.sort", "em.sort"])
          .having(({ fn }) => fn.count<number>(`${relatedEntity}.id`).distinct(), ">=", count);

        return qb;
      });
  return queryBuilder;
}
// #endregion eventFilters
