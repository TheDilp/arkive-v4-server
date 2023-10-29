import { DB } from "kysely-codegen";

export type DBKeys = keyof DB;
export type DBValues = DB[DBKeys];

export type TagsRelationTables =
  | "_charactersTotags"
  | "_documentsTotags"
  | "_boardsTotags"
  | "_mapsTotags"
  | "_calendarsTotags"
  | "_eventsTotags"
  | "_cardsTotags"
  | "_dictionariesTotags"
  | "_edgesTotags"
  | "_nodesTotags"
  | "_screensTotags"
  | "_character_fields_templatesTotags"
  | "_blueprint_instancesTotags";
export type EntitiesWithTags =
  | "maps"
  | "boards"
  | "characters"
  | "calendars"
  | "events"
  | "cards"
  | "documents"
  | "dictionaries"
  | "edges"
  | "nodes"
  | "screens"
  | "character_fields_templates";

export type EntitiesWithBreadcrumbs = "documents" | "maps" | "boards" | "dictionaries" | "random_tables";

export type EntitiesWithChildren = "documents" | "maps" | "boards" | "dictionaries" | "random_tables";
