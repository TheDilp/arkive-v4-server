import { Context } from "elysia";
import { SelectQueryBuilder, sql } from "kysely";
import { DB } from "kysely-codegen";

import { beforeRoleHandler } from "../../handlers";
import { AvailablePermissions, EntitiesWithPermissionCheck } from "../../types/entityTypes";
import { PermissionDecorationType } from "../../types/requestTypes";
import { getPermissionTableFromEntity } from "../../utils/requestUtils";
import { db } from "../db";
import { DBKeys, EntityPermissionTables } from "../types";

export function checkEntityLevelPermission(
  qb: SelectQueryBuilder<any, any, any>,
  permissions: PermissionDecorationType,
  entity: EntitiesWithPermissionCheck,
  related_id?: string,
) {
  const entityRelationTable = getPermissionTableFromEntity(entity);
  if (entityRelationTable) {
    qb = qb
      .leftJoin(entityRelationTable, `${entityRelationTable}.related_id`, `${entity}.id`)
      .where((wb: any) =>
        wb.or([
          wb(`${entity}.owner_id`, "=", permissions.user_id),
          wb.and([
            wb(`${entityRelationTable}.user_id`, "=", permissions.user_id),
            wb(`${entityRelationTable}.permission_id`, "=", permissions.permission_id),
            wb(`${entityRelationTable}.related_id`, "=", related_id || wb.ref(`${entity}.id`)),
          ]),
          wb(`${entityRelationTable}.role_id`, "=", permissions.role_id),
        ]),
      );
  } else {
    qb = qb.clearLimit().limit(0);
  }
  return qb;
}

export async function getHasEntityPermission(
  entity: EntitiesWithPermissionCheck,
  id: string,
  permissions: PermissionDecorationType,
): Promise<boolean> {
  const permissionCheck = await db
    .selectFrom(entity)
    .where(`${entity}.id`, "=", id)
    .$if(!permissions.is_project_owner, (qb) => {
      return checkEntityLevelPermission(qb, permissions, entity, id);
    })
    .select(sql<boolean>`${true}`.as("hasPermission"))
    .executeTakeFirst();

  return !!permissionCheck?.hasPermission;
}

export function getNestedReadPermission(
  subquery: SelectQueryBuilder<DB, any, any>,
  is_project_owner: boolean,
  user_id: string,
  permission_table: EntityPermissionTables,
  related_table_with_field: string,
  permission_code: AvailablePermissions,
) {
  if (!is_project_owner) {
    // @ts-ignore
    subquery = subquery
      .leftJoin(permission_table, `${permission_table}.related_id`, related_table_with_field)
      .leftJoin("permissions", `${permission_table}.permission_id`, "permissions.id")
      .where(`${permission_table}.user_id`, "=", user_id)
      .where("permissions.code", "=", permission_code);
  }
  return subquery;
}
