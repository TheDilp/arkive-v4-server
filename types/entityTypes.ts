import { RolePermissionsEnum } from "../enums";

export type AssetType = "images" | "map_images";

export type BulkDeleteEntitiesType =
  | "characters"
  | "blueprints"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "graphs"
  | "nodes"
  | "edges"
  | "calendars"
  | "dictionaries"
  | "words"
  | "random_tables"
  | "random_table_options"
  | "tags"
  | "images";

export type AvailableEntityType =
  | "projects"
  | "characters"
  | "documents"
  | "maps"
  | "graphs"
  | "dictionaries"
  | "blueprints"
  | "calendars"
  | "timelines"
  | "random_tables"
  | "character_fields_templates"
  | "character_relationship_types"
  | "tags"
  | "conversations";
export type EntitiesWithFolders = "documents" | "maps" | "graphs" | "dictionaries" | "calendars" | "random_tables";
export type PublicEntities =
  | "characters"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "graphs"
  | "calendars"
  | "dictionaries";
export type AvailableSubEntityType =
  | "alter_names"
  | "map_pins"
  | "map_layers"
  | "nodes"
  | "edges"
  | "words"
  | "months"
  | "events"
  | "random_table_options"
  | "character_fields"
  | "blueprint_instances"
  | "messages";

export type MentionEntityType = "blueprint_instances" | "characters" | "documents" | "events" | "graphs" | "maps" | "words";

export type EntitiesWithPermissionCheck =
  | "characters"
  | "blueprints"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "graphs"
  | "calendars"
  | "dictionaries"
  | "random_tables"
  | "character_fields_templates"
  | "tags"
  | "images";

export type MentionType = {
  type: "mentionAtom";
  attrs: {
    alterId?: string | null;
    projectId: string;
    icon?: string | null;
    parentId?: string | null;
    id: string;
    label: string | undefined;
    name: MentionEntityType;
  };
};

export type AvailablePermissions = (typeof RolePermissionsEnum)[keyof typeof RolePermissionsEnum];

export type InsertPermissionType =
  | ({
      related_id?: null;
    } & (
      | {
          permission_id: string;
          user_id: string;
          role_id: null;
        }
      | {
          permission_id: null;
          user_id: null;
          role_id: string;
        }
    ))[]
  | undefined;
export type UpdatePermissionType =
  | ({
      related_id: string;
    } & (
      | {
          permission_id: string;
          user_id: string;
          role_id: null;
        }
      | {
          permission_id: null;
          user_id: null;
          role_id: string;
        }
    ))[]
  | undefined;
