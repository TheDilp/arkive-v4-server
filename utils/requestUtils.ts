import { DB } from "kysely-codegen";

import { SearchableEntities } from "../types/requestTypes";

export function getSearchTableFromType(type: SearchableEntities | keyof DB): keyof DB {
  if (type === "images" || type === "map_images") return "images";
  return type;
}
