import { TableExpression } from "kysely";
import { DB } from "kysely-codegen";

import {
  BlueprintInstanceRelationEntities,
  BlueprintInstanceRelationTables,
  CharacterRelationEntities,
  CharacterRelationTables,
  CharacterResourceEntities,
  CharacterResourceTables,
  DBKeys,
  EventRelationEntities,
  EventRelationTables,
  TagsRelationTables,
} from "../database/types";
import { AvailableEntityType, AvailableSubEntityType } from "../types/entityTypes";
import { AfterHandlerActionType, SearchableEntities } from "../types/requestTypes";

export function getSearchTableFromType(type: SearchableEntities | DBKeys): DBKeys {
  if (type === "images" || type === "map_images") return "images" as DBKeys;
  return type;
}

export function getAfterHandlerActionFromType(type: AfterHandlerActionType) {
  if (type === "create") return "created";
  if (type === "update") return "updated";
  if (type === "arkive") return "arkived";
  if (type === "delete") return "deleted";
  return "";
}

export function getOperationFromPath(path: string | null, method: "GET" | "POST" | "DELETE"): AfterHandlerActionType | null {
  if (!path) return null;
  if (method === "DELETE" && path.includes("arkive")) return "arkive";
  if (method === "DELETE") return "delete";
  if (path.includes("create")) return "create";
  if (path.includes("update")) return "update";
  return null;
}
export function getPermissionOperationFromPath(
  path: string | null,
  method: "GET" | "POST" | "DELETE",
): AfterHandlerActionType | "read" | null {
  if (!path) return null;
  if (path.includes("generate")) return "create";
  if (path.includes("automention")) return "update";
  if (path.includes("mentions") || path.includes("mentioned_in")) return "read";
  if (method === "DELETE" && path.includes("arkive")) return "delete";
  if (method === "DELETE") return "delete";
  if (path.includes("create")) return "create";
  if (path.includes("update")) return "update";
  if (path.includes("resource/add") || path.includes("remove")) return "update";
  if (method === "POST") return "read";
  return null;
}

export function getEntityFromPath(
  path: string,
): AvailableEntityType | AvailableSubEntityType | "search" | "users" | "assets" | null {
  if (path.includes("bulk")) {
    const entity = path.split("/").at(-1);

    if (entity === "nodes" || entity === "edges") return "graphs";

    return (path.split("/").at(-1) as AvailableEntityType | AvailableSubEntityType | undefined) || null;
  }
  if (path.includes("assets")) return "assets";
  const entity = path.split("/")[3];

  if (entity === "nodes" || entity === "edges") return "graphs";
  if (entity === "character_map_pins") return "map_pins";
  if (entity === "conversations" || entity === "messages") return "characters";
  return entity as AvailableEntityType | AvailableSubEntityType;
}

export function getParentEntity(sub_entity: string): TableExpression<DB, DBKeys> | null {
  if (sub_entity === "blueprint_instances") return "blueprints";
  if (sub_entity === "events") return "calendars";
  if (sub_entity === "words") return "dictionaries";
  if (sub_entity === "map_pins") return "maps";
  return null;
}

export function relatedEntityFromBPIRelationTable(
  table: BlueprintInstanceRelationTables,
): BlueprintInstanceRelationEntities | null {
  if (table === "blueprint_instance_characters") return "characters";
  if (table === "blueprint_instance_documents") return "documents";
  if (table === "blueprint_instance_map_pins") return "map_pins";
  if (table === "blueprint_instance_events") return "events";
  return null;
}

export function relatedEntityFromCharacterRelationTable(table: CharacterRelationTables): CharacterRelationEntities | null {
  if (table === "character_characters_fields") return "characters";
  if (table === "character_blueprint_instance_fields") return "blueprint_instances";
  if (table === "character_documents_fields") return "documents";
  if (table === "character_locations_fields") return "map_pins";
  if (table === "character_events_fields") return "events";
  return null;
}
export function relatedEntityFromCharacterResourceTable(table: CharacterResourceTables): CharacterResourceEntities | null {
  if (table === "_charactersTodocuments") return "documents";
  if (table === "_charactersToimages") return "images";
  if (table === "maps") return "maps";
  if (table === "event_characters") return "events";
  return null;
}

export function relatedEntityFromEventRelationTable(table: EventRelationTables): EventRelationEntities | null {
  if (table === "event_characters") return "characters";
  if (table === "event_map_pins") return "map_pins";
  return null;
}

export function getEntityTagTable(type: AvailableEntityType | AvailableSubEntityType): TagsRelationTables | null {
  if (type === "manuscripts") return "manuscript_tags";
  if (type === "characters") return "_charactersTotags";
  if (type === "blueprint_instances") return "_blueprint_instancesTotags";
  if (type === "documents") return "_documentsTotags";
  if (type === "maps") return "_mapsTotags";
  if (type === "graphs") return "_graphsTotags";
  if (type === "calendars") return "_calendarsTotags";
  if (type === "character_fields_templates") return "_character_fields_templatesTotags";
  if (type === "images") return "image_tags";
  return null;
}

export function getAutomentionFields(
  type: "characters" | "documents" | "blueprint_instances" | "maps" | "map_pins" | "graphs" | "events" | "words",
) {
  if (type === "characters") return ["id", "full_name as title", "portrait_id as image_id"] as const;
  if (type === "blueprint_instances")
    return [
      "blueprint_instances.id",
      "blueprint_instances.title",
      "blueprint_instances.parent_id",
      "blueprints.icon",
      "blueprints.title as blueprint_title",
    ] as const;
  if (type === "maps" || type === "graphs") return ["id", "title"] as const;
  if (type === "words" || type === "events") return ["id", "title", "parent_id"] as const;
  return ["id", "title", "image_id"] as const;
}
