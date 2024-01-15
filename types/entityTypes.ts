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
export type EntitiesWithFolders = "documents" | "maps" | "graphs" | "dictionaries" | "calendars";

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
