import { AvailableEntityType, RequestOrderByType } from "@thearkive/types";

export function getEntityOrderBy(order: RequestOrderByType, type: AvailableEntityType) {
  const entity = getEntityModel(type);
  const finalSort = [];
  if (entity) {
    const { model } = entity;
    // @ts-ignore
    const sort = order.sort === "asc" ? asc(model[order.field]) : desc(model[order.field]);
    finalSort.push(sort);

    return finalSort;
  }
  return undefined;
}
