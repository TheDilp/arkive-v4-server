import { db } from "../database/db";
import { NoRoleAccess } from "../enums";

async function checkOwner(project_id: string | null, user_id: string) {
  if (!project_id) return false;
  const data = await db.selectFrom("projects").where("id", "=", project_id).select("owner_id").executeTakeFirst();
  if (data) {
    if (data.owner_id === user_id) return true;
    return false;
  } else {
    return false;
  }
}

export async function beforeProjectOwnerHandler(context: any) {
  const user_id = context?.headers?.["user-id"];
  const project_id = context?.headers?.["project-id"];

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
}

export function noRoleAccessErrorHandler() {
  throw new NoRoleAccess("ROLE NOT ALLOWED ACCESS");
}
