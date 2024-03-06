import { db } from "../database/db";
import { NoRoleAccess } from "../enums";

const RolePermissions = [
  "create_characters" as const,
  "read_characters" as const,
  "update_characters" as const,
  "delete_characters" as const,
  "create_blueprints" as const,
  "read_blueprints" as const,
  "update_blueprints" as const,
  "delete_blueprints" as const,
  "create_blueprint_instances" as const,
  "read_blueprint_instances" as const,
  "update_blueprint_instances" as const,
  "delete_blueprint_instances" as const,
  "create_documents" as const,
  "read_documents" as const,
  "update_documents" as const,
  "delete_documents" as const,
  "create_maps" as const,
  "read_maps" as const,
  "update_maps" as const,
  "delete_maps" as const,
  "create_graphs" as const,
  "read_graphs" as const,
  "update_graphs" as const,
  "delete_graphs" as const,
  "create_calendars" as const,
  "read_calendars" as const,
  "update_calendars" as const,
  "delete_calendars" as const,
  "create_dictionaries" as const,
  "read_dictionaries" as const,
  "update_dictionaries" as const,
  "delete_dictionaries" as const,
  "create_random_tables" as const,
  "read_random_tables" as const,
  "update_random_tables" as const,
  "delete_random_tables" as const,
  "create_tags" as const,
  "read_tags" as const,
  "update_tags" as const,
  "delete_tags" as const,
  "create_character_fields_templates" as const,
  "read_character_fields_templates" as const,
  "update_character_fields_templates" as const,
  "delete_character_fields_templates" as const,
  "create_assets" as const,
  "read_assets" as const,
  "update_assets" as const,
  "delete_assets" as const,
];

export async function checkRoleOrOwner(
  project_id: string | null,
  user_id: string,
  required_permission: (typeof RolePermissions)[keyof typeof RolePermissions],
) {
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

export function noRoleAccessErrorHandler() {
  throw new NoRoleAccess("ROLE NOT ALLOWED ACCESS");
}
