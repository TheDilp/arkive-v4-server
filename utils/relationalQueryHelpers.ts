import { ExpressionBuilder, Kysely, SelectQueryBuilder, Transaction } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { EntitiesWithBreadcrumbs, EntitiesWithChildren, EntitiesWithTags, TagsRelationTables } from "../database/types";

export function TagQuery(eb: ExpressionBuilder<DB, any>, relationalTable: TagsRelationTables, table: EntitiesWithTags) {
  return jsonArrayFrom(
    eb
      .selectFrom(relationalTable)
      .whereRef(`${table}.id`, "=", `${relationalTable}.A`)
      .leftJoin("tags", "tags.id", `${relationalTable}.B`)
      .select(["tags.id", "tags.title", "tags.color"])
      .orderBy("title", "asc"),
  ).as("tags");
}

export async function CreateTagRelations({
  tx,
  relationalTable,
  id,
  tags,
}: {
  tx: Transaction<DB>;
  relationalTable: TagsRelationTables;
  id: string;
  tags: { id: string }[];
}) {
  await tx
    .insertInto(relationalTable)
    .values(tags.map((tag) => ({ A: id, B: tag.id })))
    .execute();
}

export async function UpdateTagRelations({
  relationalTable,
  newTags,
  id,
  tx,
}: {
  relationalTable: TagsRelationTables;
  newTags: { id: string }[];
  tx: Transaction<DB>;
  id: string;
}) {
  const existingTags = await tx
    .selectFrom(relationalTable)
    .select(`${relationalTable}.B`)
    .where(`${relationalTable}.A`, "=", id)
    .execute();

  const existingTagIds = existingTags.map((tag) => tag.B);
  const newTagIds = newTags.map((tag) => tag.id);

  const tagsToDelete = existingTagIds.filter((tag) => !newTagIds.includes(tag));
  const tagsToInsert = newTagIds.filter((tag) => !existingTagIds.includes(tag));

  if (tagsToDelete.length)
    await tx
      .deleteFrom(relationalTable)
      .where(`${relationalTable}.A`, "=", id)
      .where(`${relationalTable}.B`, "in", tagsToDelete)
      .execute();

  if (tagsToInsert.length)
    await tx
      .insertInto(relationalTable)
      .values(tagsToInsert.map((tag) => ({ A: id, B: tag })))
      .execute();

  return tagsToDelete;
}

export function GetRelationsForUpdating(
  existingIds: string[],
  newData: { [key: string]: any }[],
): [string[], { [key: string]: any }[], { [key: string]: any }[]] {
  const newIds = newData.map((field) => field.id);

  const idsToRemove = existingIds.filter((id) => !newIds.includes(id));
  const itemsToAdd = newData.filter((field) => !existingIds.includes(field.id));
  const itemsToUpdate = newData.filter((field) => existingIds.includes(field.id));

  return [idsToRemove, itemsToAdd, itemsToUpdate];
}

export async function GetBreadcrumbs({
  db,
  id,
  table_name,
}: {
  db: Kysely<DB>;
  id: string;
  table_name: EntitiesWithBreadcrumbs;
}) {
  // with recursive tree as (
  //   select id,
  //          parent_id,
  //          array[id] as all_parents
  //   from hierarchy
  //   where parent_id is null

  //   union all

  //   select c.id,
  //          c.parent_id,
  //          p.all_parents||c.id
  //   from hierarchy c
  //      join tree p
  //       on c.parent_id = p.id
  //      and c.id <> ALL (p.all_parents) -- this is the trick to exclude the endless loops
  // )

  const parents_data = await db
    .withRecursive("entityWithParents", (d) =>
      d
        .selectFrom(table_name)
        .distinctOn(`${table_name}.id`)
        .where(`${table_name}.id`, "=", id)
        .select([`${table_name}.id`, `${table_name}.title`, `${table_name}.parent_id`])
        .union(
          d
            .selectFrom(`${table_name} as parents`)
            .select(["parents.id", "parents.title", "parents.parent_id"])
            .innerJoin("entityWithParents", "entityWithParents.parent_id", "parents.id"),
        ),
    )
    .selectFrom("entityWithParents")
    .selectAll()
    .execute();

  return parents_data.reverse();
}

export function GetEntityChildren(qb: SelectQueryBuilder<DB, EntitiesWithChildren, {}>, table_name: EntitiesWithChildren) {
  if (table_name === "random_tables") {
    return qb.select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom(`${table_name} as children`)
          .select(["children.id", "children.title", "children.icon", "children.is_folder"])
          .whereRef("children.parent_id", "=", `${table_name}.id`)
          .orderBy("is_folder", "asc")
          .orderBy("title", "asc"),
      ).as("children"),
    );
  } else if (table_name === "boards") {
    return qb.select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom(`${table_name} as children`)
          .select(["children.id", "children.title", "children.icon", "children.is_folder"])
          .whereRef("children.parent_id", "=", `${table_name}.id`)
          .orderBy("is_folder", "asc")
          .orderBy("title", "asc"),
      ).as("children"),
    );
  } else if (table_name === "dictionaries") {
    return qb.select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom(`${table_name} as children`)
          .select(["children.id", "children.title", "children.icon", "children.is_folder"])
          .whereRef("children.parent_id", "=", `${table_name}.id`)
          .orderBy("is_folder", "asc")
          .orderBy("title", "asc"),
      ).as("children"),
    );
  }
  return qb.select((eb) =>
    jsonArrayFrom(
      eb
        .selectFrom(`${table_name} as children`)
        .select(["children.id", "children.title", "children.icon", "children.is_folder", "children.image_id"])
        .whereRef("children.parent_id", "=", `${table_name}.id`)
        .orderBy("is_folder", "asc")
        .orderBy("title", "asc"),
    ).as("children"),
  );
}
