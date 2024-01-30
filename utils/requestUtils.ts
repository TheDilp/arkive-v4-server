import { decodeJwt } from "jose";
import { TableExpression } from "kysely";
import { DB } from "kysely-codegen";

import {
  BlueprintInstanceRelationEntities,
  BlueprintInstanceRelationTables,
  CharacterRelationEntities,
  CharacterRelationTables,
  CharacterResourceEntities,
  CharacterResourceTables,
  EventRelationEntities,
  EventRelationTables,
  TagsRelationTables,
} from "../database/types";
import { AvailableEntityType, AvailableSubEntityType } from "../types/entityTypes";
import { AfterHandlerActionType, JWTPayloadType, SearchableEntities } from "../types/requestTypes";

export function getSearchTableFromType(type: SearchableEntities | keyof DB): keyof DB {
  if (type === "images" || type === "map_images") return "images";
  return type;
}

export function decodeUserJwt(jwt: string) {
  return decodeJwt<JWTPayloadType>(jwt);
}

export function getAfterHandlerActionFromType(type: AfterHandlerActionType) {
  if (type === "create") return "created a";
  if (type === "update") return "updated a";
  if (type === "delete") return "deleted a";
  if (type === "delete_many") return "deleted many";
  return "";
}

export function getOperationFromPath(path: string, method: "GET" | "POST" | "DELETE"): AfterHandlerActionType | null {
  if (method === "DELETE") return "delete";
  if (path.includes("create")) return "create";
  if (path.includes("update")) return "update";
  if (path.includes("delete_many")) return "delete_many";
  return null;
}

export function getEntityFromPath(path: string): string {
  const entity = path.split("/")[3];
  if (entity === "character_map_pins") return "map_pins";
  return entity;
}

export function getParentEntity(sub_entity: string): TableExpression<DB, AvailableEntityType | AvailableSubEntityType> | null {
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
  if (type === "characters") return "_charactersTotags";
  if (type === "blueprint_instances") return "_blueprint_instancesTotags";
  if (type === "documents") return "_documentsTotags";
  if (type === "maps") return "_mapsTotags";
  if (type === "graphs") return "_graphsTotags";
  if (type === "calendars") return "_calendarsTotags";
  if (type === "character_fields_templates") return "_character_fields_templatesTotags";
  return null;
}
