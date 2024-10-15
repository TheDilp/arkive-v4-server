import { PermissionDecorationType } from "../../types/requestTypes";
import { db } from "../db";
import { checkEntityLevelPermission } from "./ownershipCheck";

export async function getAllProjectTags(project_id: string, permissions: PermissionDecorationType) {
  let query = db
    .selectFrom("tags")
    .select(["tags.id", "tags.title", "tags.color"])
    .where("tags.project_id", "=", project_id)
    .where("tags.deleted_at", "is", null)
    .orderBy("title asc");

  if (!permissions.is_project_owner) {
    query = checkEntityLevelPermission(query, permissions, "tags");
  }

  const data = await query.execute();

  return data;
}
