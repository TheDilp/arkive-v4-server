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

export type BulkArkiveEntitiesType =
  | "characters"
  | "blueprints"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "graphs"
  | "calendars"
  | "dictionaries"
  | "random_tables"
  | "tags"
  | "character_fields_templates";

export type AvailableEntityType =
  | "projects"
  | "manuscripts"
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
  | "conversations"
  | "images";
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

export type MentionEntityType =
  | "characters"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "events"
  | "words";

export type EntitiesWithPermissionCheck =
  | "characters"
  | "blueprints"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "calendars"
  | "events"
  | "dictionaries"
  | "words"
  | "random_tables"
  | "character_fields_templates"
  | "tags"
  | "images"
  | "manuscripts"
  | "gateway_configurations";

export type GatewayConfigEntityTypes =
  | "characters"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "map_pins"
  | "events"
  | "images"
  | "random_tables"
  | "tags";

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

export type AvailablePermissions = (typeof RolePermissionsEnum)[number];

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

export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string;
  email: string;
};

type JWTClaims = {
  user_id: string;
  project_id: string | null;
  image_url: string | null;
  is_email_confirmed: boolean | null;
  name: string | null;
};

type JWTGatewayClaims = {
  access_id: string;
  project_id: string | null;
};

export type JWTResponse = {
  access: string;
  refresh: string;
  claims: JWTClaims;
};
export type JWTGatewayResponse = {
  access: string;
  claims: JWTGatewayClaims;
};

export type GatewayAccessType = {
  access_id: string;
  project_id: string;
  code: string;
  config: Record<GatewayConfigEntityTypes, string[]>;
} & (
  | {
      gateway_type: "create";
      create_config:
        | ({
            is_locked: true;
          } & (
            | {
                first_name: string;
                last_name: string;
              }
            | {
                title: string;
              }
          ))
        | ({
            is_locked: false;
          } & {
            first_name?: string;
            last_name?: string;
            title?: string;
          });
    }
  | {
      gateway_type: "update";
      entity_id: string;
    }
);
