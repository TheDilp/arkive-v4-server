import { TagsRelationTables } from "../database/types";

export const AllEntities = [
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
  "screens",
  "character_fields_templates",
  "character_fields",
  "tags",
];

export const SubEntityEnum = ["alter_names", "map_pins", "character_map_pins", "map_layers", "nodes", "edges"];

export const EntitiesWithTagsTables: TagsRelationTables[] = [
  "_charactersTotags",
  "_documentsTotags",
  "_boardsTotags",
  "_mapsTotags",
  "_calendarsTotags",
  "_cardsTotags",
  "_dictionariesTotags",
  "_edgesTotags",
  "_nodesTotags",
  "_screensTotags",
];

export const EntitiesWithoutProjectId = ["map_pins", "character_map_pins", "map_layers", "nodes", "edges", "events"];
