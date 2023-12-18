import { decodeJwt } from "jose";
import { TableExpression } from "kysely";
import { DB } from "kysely-codegen";

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
