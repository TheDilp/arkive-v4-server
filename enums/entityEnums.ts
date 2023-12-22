import { TagsRelationTables } from "../database/types";

export const AllEntities = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "calendars",
  "dictionaries",
  "character_fields_templates",
  "character_fields",
  "conversations",
  "random_tables",
  "tags",
];

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

export const EntitiesWithTagsTables: TagsRelationTables[] = [
  "_charactersTotags",
  "_documentsTotags",
  "_graphsTotags",
  "_mapsTotags",
  "_calendarsTotags",
  "_dictionariesTotags",
  "_blueprint_instancesTotags",
  "_edgesTotags",
  "_nodesTotags",
];

export const EntitiesWithoutProjectId = ["map_pins", "character_map_pins", "map_layers", "nodes", "edges", "events"];

export const UserNotificationEntities = [
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

export const BulkDeleteEntities = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "nodes",
  "edges",
  "calendars",
  "dictionaries",
  "words",
  "random_tables",
  "random_table_options",
  "tags",
  "images",
];
