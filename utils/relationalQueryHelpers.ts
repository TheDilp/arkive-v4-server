import { ExpressionBuilder, Transaction } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { EntitiesWithTags, TagsRelationTables } from "../database/types";

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

  if (tagsToDelete.length) await tx.deleteFrom(relationalTable).where(`${relationalTable}.B`, "in", tagsToDelete).execute();

  if (tagsToInsert.length)
    await tx
      .insertInto(relationalTable)
      .values(tagsToInsert.map((tag) => ({ A: id, B: tag })))
      .execute();
}

export function GetRelationsForUpdating(
  existingIds: string[],
  newData: { id: string }[],
): [string[], { [key: string]: any }[], { [key: string]: any }[]] {
  const newIds = newData.map((field) => field.id);

  const idsToRemove = existingIds.filter((id) => !newIds.includes(id));
  const itemsToAdd = newData.filter((field) => !existingIds.includes(field.id));
  const itemsToUpdate = newData.filter((field) => existingIds.includes(field.id));

  return [idsToRemove, itemsToAdd, itemsToUpdate];
}
