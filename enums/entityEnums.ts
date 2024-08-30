import { TagsRelationTables } from "../database/types";

export const SubEntityEnum = [
  "alter_names",
  "blueprint_instances",
  "map_pins",
  "character_map_pins",
  "map_layers",
  "nodes",
  "edges",
  "events",
  "random_table_options",
  "random_table_suboptions",
  "words",
];

export const MentionTypeEnum = [
  "characters",
  "documents",
  "maps",
  "graphs",
  "blueprint_instances",
  "words",
  "events",
  "map_pins",
];

export const DocumentTemplateFieldEntitiesWithRelated = [
  "characters",
  "blueprint_instances",
  "documents",
  "maps",
  "map_pins",
  "graphs",
  "events",
  "words",
  "random_tables",
];

export const EntitiesWithTagsTablesEnum: TagsRelationTables[] = [
  "_charactersTotags",
  "_documentsTotags",
  "_graphsTotags",
  "_mapsTotags",
  "_map_pinsTotags",
  "_calendarsTotags",
  "_eventsTotags",
  "_dictionariesTotags",
  "_edgesTotags",
  "_nodesTotags",
  "_character_fields_templatesTotags",
  "_blueprint_instancesTotags",
  "image_tags",
  "manuscript_tags",
];

export const newTagTables = ["image_tags", "manuscript_tags"];

export const UserNotificationEntitiesEnum = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "map_pins",
  "graphs",
  "calendars",
  "events",
  "dictionaries",
  "words",
  "character_fields_templates",
  "tags",
];

export const BulkDeleteEntitiesEnum = [
  "manuscripts",
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "nodes",
  "edges",
  "calendars",
  "events",
  "dictionaries",
  "words",
  "random_tables",
  "random_table_options",
  "tags",
  "character_fields_templates",
];
export const BulkArkiveEntitiesEnum = [
  "manuscripts",
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "calendars",
  "dictionaries",
  "random_tables",
  "tags",
  "character_fields_templates",
];

export const RolePermissionsEnum = [
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
  "create_map_pins" as const,
  "read_map_pins" as const,
  "update_map_pins" as const,
  "delete_map_pins" as const,
  "create_graphs" as const,
  "read_graphs" as const,
  "update_graphs" as const,
  "delete_graphs" as const,
  "create_calendars" as const,
  "read_calendars" as const,
  "update_calendars" as const,
  "delete_calendars" as const,
  "create_events" as const,
  "read_events" as const,
  "update_events" as const,
  "delete_events" as const,
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
  "create_words" as const,
  "read_words" as const,
  "update_words" as const,
  "delete_words" as const,
  "create_manuscripts" as const,
  "read_manuscripts" as const,
  "update_manuscripts" as const,
  "delete_manuscripts" as const,
  "create_gateway" as const,
  "read_gateway" as const,
  "update_gateway" as const,
  "delete_gateway" as const,
];

export const EntitiesWithPermissionsEnum = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "calendars",
  "dictionaries",
  "random_tables",
  "images",
  "assets",
  "tags",
  "character_fields_templates",
];

export const DocumentTemplateEntities = [
  "characters",
  "blueprint_instances",
  "documents",
  "maps",
  "map_pins",
  "graphs",
  "calendars",
  "events",
  "dictionaries",
  "random_tables",
  "words",
];
export const ProjectOwnerAllPermissionsEnum = {
  create_characters: true,
  read_characters: true,
  update_characters: true,
  delete_characters: true,
  create_blueprints: true,
  read_blueprints: true,
  update_blueprints: true,
  delete_blueprints: true,
  create_blueprint_instances: true,
  read_blueprint_instances: true,
  update_blueprint_instances: true,
  delete_blueprint_instances: true,
  create_documents: true,
  read_documents: true,
  update_documents: true,
  delete_documents: true,
  create_maps: true,
  read_maps: true,
  update_maps: true,
  delete_maps: true,
  create_map_pins: true,
  read_map_pins: true,
  update_map_pins: true,
  delete_map_pins: true,
  create_graphs: true,
  read_graphs: true,
  update_graphs: true,
  delete_graphs: true,
  create_calendars: true,
  read_calendars: true,
  update_calendars: true,
  delete_calendars: true,
  create_events: true,
  read_events: true,
  update_events: true,
  delete_events: true,
  create_dictionaries: true,
  read_dictionaries: true,
  update_dictionaries: true,
  delete_dictionaries: true,
  create_words: true,
  read_words: true,
  update_words: true,
  delete_words: true,
  create_random_tables: true,
  read_random_tables: true,
  update_random_tables: true,
  delete_random_tables: true,
  create_tags: true,
  read_tags: true,
  update_tags: true,
  delete_tags: true,
  create_character_fields_templates: true,
  read_character_fields_templates: true,
  update_character_fields_templates: true,
  delete_character_fields_templates: true,
  create_assets: true,
  read_assets: true,
  update_assets: true,
  delete_assets: true,
};
