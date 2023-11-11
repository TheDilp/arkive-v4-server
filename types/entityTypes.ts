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
  | "screens"
  | "dictionaries"
  | "blueprints"
  | "calendars"
  | "timelines"
  | "random_tables"
  | "character_fields_templates"
  | "generators"
  | "character_relationship_types"
  | "tags"
  | "conversations";

export type AvailableSubEntityType =
  | "alter_names"
  | "map_pins"
  | "character_map_pins"
  | "map_layers"
  | "nodes"
  | "edges"
  | "sections"
  | "cards"
  | "words"
  | "months"
  | "events"
  | "random_table_options"
  | "character_fields"
  | "blueprint_instances"
  | "messages";
