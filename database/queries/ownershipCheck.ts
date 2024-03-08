import { SelectQueryBuilder } from "kysely";

import { EntitiesWithPermissionCheck } from "../../types/entityTypes";
import { PermissionDecorationType } from "../../types/requestTypes";
import { getPermissionTableFromEntity } from "../../utils/requestUtils";

export function checkEntityLevelPermission(
  qb: SelectQueryBuilder<any, any, any>,
  permissions: PermissionDecorationType,
  entity: EntitiesWithPermissionCheck,
) {
  const entityRelationTable = getPermissionTableFromEntity(entity);
  console.log(permissions);
  if (entityRelationTable) {
    qb = qb.where((wb) =>
      wb.or([
        wb(`${entity}.owner_id`, "=", permissions.user_id),
        wb.and([
          wb(`${entityRelationTable}.user_id`, "=", permissions.user_id),
          wb(`${entityRelationTable}.permission_id`, "=", permissions.permission_id),
          wb(`${entityRelationTable}.related_id`, "=", wb.ref(`${entity}.id`)),
        ]),
        wb.and([wb(`${entityRelationTable}.role_id`, "=", permissions.role_id)]),
      ]),
    );
  }
  return qb;
}
