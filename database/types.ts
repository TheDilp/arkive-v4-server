import { DB } from "kysely-codegen";

export type DBKeys = keyof DB;
export type DBValues = DB[DBKeys];

export type TagsRelationTables =
  | "_charactersTotags"
  | "_documentsTotags"
  | "_boardsTotags"
  | "_mapsTotags"
  | "_calendarsTotags"
  | "_cardsTotags"
  | "_dictionariesTotags"
  | "_edgesTotags"
  | "_nodesTotags"
  | "_screensTotags";
export type EntitiesWithTags =
  | "maps"
  | "boards"
  | "characters"
  | "calendars"
  | "cards"
  | "documents"
  | "dictionaries"
  | "edges"
  | "nodes"
  | "screens";

export type EntitiesWithBreadcrumbs = "documents" | "maps" | "boards" | "random_tables";

export type EntitiesWithChildren = "documents" | "maps" | "boards" | "random_tables";
