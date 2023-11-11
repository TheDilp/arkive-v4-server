import { decodeJwt } from "jose";
import { DB } from "kysely-codegen";

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
