import { DB } from "kysely-codegen";

export type DBKeys = keyof DB;
export type DBValues = DB[DBKeys];

export type TagsRelationTables =
  | "_charactersTotags"
  | "_documentsTotags"
  | "_graphsTotags"
  | "_mapsTotags"
  | "_calendarsTotags"
  | "_eventsTotags"
  | "_dictionariesTotags"
  | "_edgesTotags"
  | "_nodesTotags"
  | "_character_fields_templatesTotags"
  | "_blueprint_instancesTotags";
export type EntitiesWithTags =
  | "maps"
  | "graphs"
  | "characters"
  | "calendars"
  | "events"
  | "documents"
  | "dictionaries"
  | "edges"
  | "nodes"
  | "character_fields_templates"
  | "blueprint_instances";

export type EntitiesWithBreadcrumbs = "documents" | "maps" | "graphs" | "dictionaries" | "random_tables";

export type EntitiesWithChildren = "documents" | "maps" | "graphs" | "dictionaries" | "random_tables";

export type BlueprintInstanceRelationEntities = "characters" | "documents" | "map_pins";
export type CharacterRelationEntities = "blueprint_instances" | "documents" | "map_pins";

export type BlueprintInstanceRelationTables =
  | "blueprint_instance_characters"
  | "blueprint_instance_documents"
  | "blueprint_instance_map_pins";

export type CharacterRelationTables =
  | "character_blueprint_instance_fields"
  | "character_documents_fields"
  | "character_locations_fields";
