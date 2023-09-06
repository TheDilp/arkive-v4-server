import { TagsRelationTables } from "../database/types";

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
