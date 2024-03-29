import { db } from "../database/db";
import { NoRoleAccess, UnauthorizedError } from "../enums";
import { AvailablePermissions } from "../types/entityTypes";
import { PermissionDecorationType } from "../types/requestTypes";
import { decodeUserJwt } from "../utils/requestUtils";

export async function checkRole(
  project_id: string | null,
  user_id: string,
  required_permission: AvailablePermissions,
): Promise<PermissionDecorationType> {
  if (!project_id) return { is_project_owner: false, user_id: "", role_access: false, role_id: null, permission_id: null };
  const data = await db
    .selectFrom("user_project_roles_permissions")
    .where("permission_slug", "=", required_permission as string)
    .where("project_id", "=", project_id)
    .where("user_id", "=", user_id)
    .select(["permission_slug", "owner_id", "role_id", "permission_id"])
    .executeTakeFirst();
  if (data) {
    return {
      user_id,
      is_project_owner: data.owner_id === user_id,
      role_access: data.permission_slug === required_permission,
      role_id: data.role_id,
      permission_id: data.permission_id,
    };
  } else {
    if (!project_id) return { user_id, is_project_owner: false, role_access: false, role_id: null, permission_id: null };
  }
  return { user_id, is_project_owner: false, role_access: false, role_id: null, permission_id: null };
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

export async function beforeRoleHandler(context: any, permission: AvailablePermissions) {
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
      const { is_project_owner, role_access, role_id, permission_id } = await checkRole(
        project_id as string | null,
        user_id as string,
        permission,
      );
      if (is_project_owner || role_access) {
        context.permissions = { is_project_owner, role_access, user_id, role_id, permission_id };
        return;
      } else {
        context.permissions = { is_project_owner: false, role_access: false, user_id };

        noRoleAccessErrorHandler();
      }
    } else {
      context.permissions = { is_project_owner: false, role_access: false, user_id };

      noRoleAccessErrorHandler();
    }
  } else {
    context.permissions = { is_project_owner: false, role_access: false, user_id: "" };
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
