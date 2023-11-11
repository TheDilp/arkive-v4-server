import { TagsRelationTables } from "../database/types";

export const AllEntities = [
  "characters",
  "documents",
  "maps",
  "map_pins",
  "map_layers",
  "graphs",
  "nodes",
  "edges",
  "calendars",
  "events",
  "dictionaries",
  "words",
  "screens",
  "character_fields_templates",
  "character_fields",
  "conversations",
  "tags",
];

export const SubEntityEnum = ["alter_names", "map_pins", "character_map_pins", "map_layers", "nodes", "edges"];

export const EntitiesWithTagsTables: TagsRelationTables[] = [
  "_charactersTotags",
  "_documentsTotags",
  "_graphsTotags",
  "_mapsTotags",
  "_calendarsTotags",
  "_dictionariesTotags",
  "_edgesTotags",
  "_nodesTotags",
];

export const EntitiesWithoutProjectId = ["map_pins", "character_map_pins", "map_layers", "nodes", "edges", "events"];
