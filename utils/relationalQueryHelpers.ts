import { DeleteQueryBuilder, DeleteResult, ExpressionBuilder, Kysely, SelectQueryBuilder, Transaction } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { getNestedReadPermission } from "../database/queries";
import { EntitiesWithChildren, EntitiesWithTags, TagsRelationTables } from "../database/types";
import {
  AvailablePermissions,
  EntitiesWithFolders,
  EntitiesWithPermissionCheck,
  InsertPermissionType,
  UpdatePermissionType,
} from "../types/entityTypes";
import { PermissionDecorationType } from "../types/requestTypes";

export function TagQuery(
  eb: ExpressionBuilder<any, any>,
  relationalTable: TagsRelationTables,
  table: EntitiesWithTags,
  is_project_owner: boolean,
  user_id: string,
) {
  let tag_query = eb.selectFrom(relationalTable);

  tag_query = tag_query
    .whereRef(`${table}.id`, "=", `${relationalTable}.${relationalTable === "image_tags" ? "image_id" : "A"}`)
    .leftJoin("tags", "tags.id", `${relationalTable}.${relationalTable === "image_tags" ? "tag_id" : "B"}`)
    .where("tags.deleted_at", "is", null)
    .select(["tags.id", "tags.title", "tags.color"]);

  if (user_id) {
    if (relationalTable === "image_tags") {
      tag_query = getNestedReadPermission(tag_query, is_project_owner, user_id, `${relationalTable}.tag_id`, "read_tags");
    } else {
      // @ts-ignore
      tag_query = getNestedReadPermission(tag_query, is_project_owner, user_id, `${relationalTable}.B`, "read_tags");
    }
  }

  return jsonArrayFrom(tag_query).as("tags");
}

export async function CreateTagRelations({
  tx,
  relationalTable,
  id,
  tags,
}: {
  tx: Transaction<any>;
  relationalTable: TagsRelationTables;
  id: string;
  tags: { id: string }[];
}) {
  await tx
    .insertInto(relationalTable)
    .values(tags.map((tag) => ({ A: id, B: tag.id })))
    .onConflict((oc) => oc.columns(relationalTable === "image_tags" ? ["image_id", "tag_id"] : ["A", "B"]).doNothing())
    .execute();
}

export async function UpdateTagRelations({
  relationalTable,
  newTags,
  id,
  tx,
  is_project_owner,
}: {
  relationalTable: TagsRelationTables;
  newTags: { id: string }[];
  tx: Transaction<any>;
  id: string;
  is_project_owner: boolean;
}) {
  const existingTags = await tx
    .selectFrom(relationalTable)
    .select(`${relationalTable}.${relationalTable === "image_tags" ? "tag_id" : "B"}`)
    .where(`${relationalTable}.${relationalTable === "image_tags" ? "image_id" : "A"}`, "=", id)
    .execute();

  const existingTagIds = existingTags.map((tag) => (relationalTable === "image_tags" ? tag.tag_id : tag.B));
  const newTagIds = newTags.map((tag) => tag.id);

  const tagsToDelete = existingTagIds.filter((tag) => !newTagIds.includes(tag));
  const tagsToInsert = newTagIds.filter((tag) => !existingTagIds.includes(tag));

  if (tagsToDelete.length) {
    let delete_query = tx
      .deleteFrom(relationalTable)
      .where(`${relationalTable}.${relationalTable === "image_tags" ? "image_id" : "A"}`, "=", id)
      .where(`${relationalTable}.${relationalTable === "image_tags" ? "tag_id" : "B"}`, "in", tagsToDelete);

    if (!is_project_owner) {
      delete_query = checkDeletePermissions(
        delete_query,
        `${relationalTable}.${relationalTable === "image_tags" ? "tag_id" : "B"}`,
        "read_tags",
      );
    }

    await delete_query.execute();
  }

  if (tagsToInsert.length)
    await tx
      .insertInto(relationalTable)
      .values(tagsToInsert.map((tag) => (relationalTable === "image_tags" ? { image_id: id, tag_id: tag } : { A: id, B: tag })))
      .onConflict((oc) => oc.columns(relationalTable === "image_tags" ? ["image_id", "tag_id"] : ["A", "B"]).doNothing())
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

export async function GetParents({ db, id, table_name }: { db: Kysely<DB>; id: string; table_name: EntitiesWithFolders }) {
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
        .select([`${table_name}.id`, `${table_name}.title`, `${table_name}.parent_id`, `${table_name}.is_folder`])
        .union(
          d
            .selectFrom(`${table_name} as parents`)
            .select(["parents.id", "parents.title", "parents.parent_id", "parents.is_folder"])
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
  } else if (table_name === "graphs") {
    return qb.select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom(`${table_name} as children`)
          .select([
            "children.id",
            "children.title",
            "children.icon",
            "children.is_folder",
            (eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("tags")
                  .leftJoin(`_${table_name}Totags as tag_relation`, "tag_relation.B", "tags.id")
                  .whereRef("children.id", "=", "tag_relation.A")
                  .select(["tags.id", "tags.title", "tags.color"]),
              ).as("tags"),
          ])
          .whereRef("children.parent_id", "=", `${table_name}.id`)
          .orderBy("is_folder", "asc")
          .orderBy("title", "asc"),
      ).as("children"),
    );
  } else if (table_name === "calendars") {
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
        .select([
          "children.id",
          "children.title",
          "children.icon",
          "children.is_folder",
          "children.image_id",
          (eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("tags")
                .leftJoin(`_${table_name}Totags as tag_relation`, "tag_relation.B", "tags.id")
                .whereRef("children.id", "=", "tag_relation.A")
                .select(["tags.id", "tags.title", "tags.color"]),
            ).as("tags"),
        ])
        .whereRef("children.parent_id", "=", `${table_name}.id`)
        .orderBy("is_folder", "asc")
        .orderBy("title", "asc"),
    ).as("children"),
  );
}

export async function UpdateCharacterRelationships({
  tx,
  id,
  related,
  relation_direction,
}: {
  tx: Transaction<DB>;
  id: string;
  related: {
    character_relationship_id?: string | undefined;
    id: string;
    relation_type_id: string;
  }[];
  relation_direction: "related_to" | "related_other" | "related_from";
}) {
  const id1: "character_a_id" | "character_b_id" =
    relation_direction === "related_from" ? ("character_a_id" as const) : ("character_b_id" as const);
  const id2: "character_a_id" | "character_b_id" =
    relation_direction === "related_from" ? ("character_b_id" as const) : ("character_a_id" as const);

  const existingRelated = await tx
    .selectFrom("characters_relationships")
    .leftJoin("character_relationship_types", "character_relationship_types.id", "characters_relationships.relation_type_id")
    .where(id2, "=", id)
    .where((wb) =>
      wb.and([
        wb("character_relationship_types.ascendant_title", relation_direction === "related_other" ? "is" : "is not", null),
        wb("character_relationship_types.descendant_title", relation_direction === "related_other" ? "is" : "is not", null),
      ]),
    )
    .select([`${id1} as id`, id2, "relation_type_id", "characters_relationships.id as character_relationship_id"])
    .execute();
  // const existingIds = existingRelatedTo.map((relation) => relation.id);

  const itemsToAdd = (related || [])?.filter((r) => !r.character_relationship_id);
  const itemsWithIds = (related || [])?.filter((r) => !!r.character_relationship_id);

  const itemsToRemove = existingRelated.filter(
    (ex) => !itemsWithIds?.some((r) => r.id === ex.id && r.character_relationship_id === ex.character_relationship_id),
  );

  if (itemsToRemove.length) {
    await Promise.all(
      itemsToRemove.map((item) =>
        tx
          .deleteFrom("characters_relationships")
          .where("characters_relationships.id", "=", item.character_relationship_id)
          .execute(),
      ),
    );
  }
  if (itemsToAdd.length) {
    await tx
      .insertInto("characters_relationships")
      .values(
        //@ts-ignore
        itemsToAdd.map((item) => ({
          [id2]: id,
          [id1]: item.id,
          relation_type_id: item.relation_type_id,
        })),
      )
      .execute();
  }
}

export async function CreateEntityPermissions(tx: Transaction<DB>, id: string, permissions: InsertPermissionType) {
  if (permissions?.length)
    await tx
      .insertInto("entity_permissions")
      .values(
        permissions.map((p) => ({
          related_id: id,
          user_id: p.user_id,
          role_id: p.role_id,
          permission_id: p.permission_id,
        })),
      )
      .execute();
}
export async function UpdateEntityPermissions(tx: Transaction<DB>, id: string, permissions: UpdatePermissionType) {
  await tx.deleteFrom("entity_permissions").where("related_id", "=", id).execute();
  if (permissions?.length) {
    await tx
      .insertInto("entity_permissions")
      .values(
        permissions.map((perm) => ({
          related_id: id,
          permission_id: "permission_id" in perm ? perm.permission_id : null,
          user_id: "user_id" in perm ? perm.user_id : null,
          role_id: "role_id" in perm ? perm.role_id : null,
        })),
      )
      // @ts-ignore
      .onConflict((oc) => oc.columns(["related_id", "role_id"]).doUpdateSet((eb) => ({ role_id: eb.ref("excluded.role_id") })))
      .onConflict((oc) => oc.columns(["user_id", "related_id", "permission_id"]).doNothing())
      .execute();
  }
}
export function GetRelatedEntityPermissionsAndRoles(
  qb: SelectQueryBuilder<DB, any, any>,
  permissions: PermissionDecorationType,
  entity: EntitiesWithPermissionCheck,
  id?: string,
) {
  const permissionTable = "entity_permissions";
  if (permissionTable) {
    qb = qb.select([
      (eb: ExpressionBuilder<any, any>) => {
        let expression = eb.selectFrom(permissionTable);
        if (id) {
          expression = expression.where(`${permissionTable}.related_id`, "=", id);
        } else {
          expression = expression.whereRef(`${permissionTable}.related_id`, "=", `${entity}.id`);
        }
        expression = expression
          .leftJoin("permissions", "permissions.id", `${permissionTable}.permission_id`)
          .select(
            id
              ? [
                  `${permissionTable}.id`,
                  `${permissionTable}.permission_id`,
                  `${permissionTable}.related_id`,
                  `${permissionTable}.role_id`,
                  `${permissionTable}.user_id`,
                  "permissions.code",
                ]
              : ["permissions.code", `${permissionTable}.role_id`],
          );

        if (!permissions.is_project_owner) {
          expression = expression.where((wb) =>
            wb.or([
              wb(`${permissionTable}.user_id`, "=", permissions.user_id),
              wb(`${permissionTable}.role_id`, "=", permissions.role_id),
            ]),
          );
        }

        return jsonArrayFrom(expression).as("permissions");
      },
    ]);
  } else {
    console.error("NO PERMISSION TABLE", entity);
  }
  return qb;
}

export function checkDeletePermissions(
  query: DeleteQueryBuilder<DB, any, DeleteResult>,
  reference_table_with_column: string,
  required_permission: AvailablePermissions,
) {
  // @ts-ignore
  query = query
    .using("entity_permissions")
    .leftJoin("permissions", "permission_id", "entity_permissions.permission_id")
    .whereRef("entity_permissions.related_id", "=", reference_table_with_column)
    .where("permissions.code", "=", required_permission);

  return query;
}
