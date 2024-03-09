import { sql } from "kysely";

import { EntitiesWithPermissionCheck } from "../../types/entityTypes";
import { PermissionDecorationType } from "../../types/requestTypes";
import { getPermissionTableFromEntity } from "../../utils/requestUtils";
import { db } from "../db";

export function checkEntityLevelPermission(
  qb: any,
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
    .$if(!permissions.is_owner, (qb) => {
      return checkEntityLevelPermission(qb, permissions, entity, id);
    })
    .select(sql<boolean>`${true}`.as("hasPermission"))
    .executeTakeFirst();

  return !!permissionCheck?.hasPermission;
}
