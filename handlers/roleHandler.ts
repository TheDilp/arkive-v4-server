import { db } from "../database/db";
import { NoRoleAccess, UnauthorizedError } from "../enums";
import { AvailablePermissions } from "../types/entityTypes";
import { decodeUserJwt } from "../utils/requestUtils";

export async function checkRoleOrOwner(project_id: string | null, user_id: string, required_permission: AvailablePermissions) {
  if (!project_id) return false;
  const data = await db
    .selectFrom("user_project_roles_permissions")
    .where((wb) =>
      wb.or([
        wb.and([
          wb("permission_slug", "=", required_permission as string),
          wb("project_id", "=", project_id),
          wb("user_id", "=", user_id),
        ]),
        wb("owner_id", "=", user_id),
      ]),
    )
    .select(["permission_slug" as const, "owner_id"])
    .executeTakeFirst();
  if (data) {
    if (data.owner_id === user_id) return true;
    if (data.permission_slug === required_permission) return true;
    return false;
  } else {
    return false;
  }
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
      const isRoleValid = await checkRoleOrOwner(project_id as string | null, user_id as string, permission);
      if (!isRoleValid) {
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

export async function beforeProjectOwnerHandler(context: any) {
  const token = context?.headers?.["authorization"];
  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { user_id, project_id } = decodeUserJwt(jwt);

    if (user_id && project_id) {
      const isRoleValid = await checkOwner(project_id as string | null, user_id as string);
      if (!isRoleValid) {
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
