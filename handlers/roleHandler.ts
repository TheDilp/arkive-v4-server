import { db } from "../database/db";
import { NoRoleAccess, UnauthorizedError } from "../enums";
import { AvailablePermissions } from "../types/entityTypes";
import { PermissionDecorationType } from "../types/requestTypes";
import { decodeUserJwt } from "../utils/requestUtils";

export async function checkRole(
  project_id: string | null,
  user_id: string,
  required_permission: AvailablePermissions | undefined,
  isGlobalSearch?: boolean,
): Promise<PermissionDecorationType> {
  if (isGlobalSearch) {
    return { is_project_owner: false, user_id, role_access: true, role_id: null, permission_id: null, all_permissions: [] };
  }
  if (!project_id || !required_permission)
    return { is_project_owner: false, user_id, role_access: false, role_id: null, permission_id: null, all_permissions: [] };
  const data = await db
    .selectFrom("user_project_roles_permissions")
    // .where("permission_slug", "=", required_permission as string)
    .where("project_id", "=", project_id)
    .where("user_id", "=", user_id)
    .select(["permission_slug", "owner_id", "role_id", "permission_id"])
    .execute();
  const item = data?.find((perm) => perm.permission_slug === required_permission);
  console.log(data);
  if (data && item) {
    return {
      user_id,
      is_project_owner: item.owner_id === user_id,
      role_access: item.permission_slug === required_permission,
      role_id: item.role_id,
      permission_id: item.permission_id,
      all_permissions: (data || []).map((perm) => perm.permission_slug as AvailablePermissions),
    };
  } else {
    if (!project_id)
      return { user_id, is_project_owner: false, role_access: false, role_id: null, permission_id: null, all_permissions: [] };
  }
  return { user_id, is_project_owner: false, role_access: false, role_id: null, permission_id: null, all_permissions: [] };
}

export async function checkOwner(project_id: string | null, user_id: string) {
  if (!project_id) return false;
  const data = await db.selectFrom("projects").where("id", "=", project_id).select("owner_id").executeTakeFirst();
  if (data) {
    if (data.owner_id === user_id) return true;
    return false;
  } else {
    return false;
  }
}

export async function beforeRoleHandler(context: any, permission: AvailablePermissions | undefined, isGlobalSearch?: boolean) {
  const token = context?.headers?.["authorization"];
  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { user_id, project_id } = decodeUserJwt(jwt);
    if (user_id && project_id) {
      // Required as the permissions table won't retrieve the project owner's role as there will be none
      const isProjectOwner = await checkOwner(project_id as string, user_id as string);
      if (isProjectOwner) {
        context.permissions = { is_project_owner: isProjectOwner, role_access: false, user_id };
        return;
      }
      const { is_project_owner, role_access, role_id, permission_id, all_permissions } = await checkRole(
        project_id as string | null,
        user_id as string,
        permission,
        isGlobalSearch,
      );
      if (is_project_owner || role_access) {
        context.permissions = { is_project_owner, role_access, user_id, role_id, permission_id, all_permissions };
        return;
      } else {
        context.permissions = { is_project_owner: false, role_access: false, user_id, all_permissions: [] };

        noRoleAccessErrorHandler();
      }
    } else {
      context.permissions = { is_project_owner: false, role_access: false, user_id, all_permissions: [] };

      noRoleAccessErrorHandler();
    }
  } else {
    context.permissions = { is_project_owner: false, role_access: false, user_id: "", all_permissions: [] };
    console.error("MISSING TOKEN");
    throw new UnauthorizedError("UNAUTHORIZED");
  }
}

export async function beforeProjectOwnerHandler(context: any) {
  const token = context?.headers?.["authorization"];
  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { user_id, project_id } = decodeUserJwt(jwt);

    if (user_id && project_id) {
      const isRoleValid = await checkOwner(project_id as string | null, user_id as string);
      if (isRoleValid) {
        context.permissions = { user_id, project_id };
      } else {
        context.permissions = { user_id: null, project_id: null };
        noRoleAccessErrorHandler();
      }
    } else {
      noRoleAccessErrorHandler();
    }
  } else {
    console.error("MISSING TOKEN", "LIST CHARACTERS");
    throw new UnauthorizedError("UNAUTHORIZED");
  }
}

export function noRoleAccessErrorHandler() {
  throw new NoRoleAccess("ROLE NOT ALLOWED ACCESS");
}
