import { DB } from "kysely-codegen";

import { SearchableEntities } from "../types/requestTypes";

export function getSearchTableFromType(type: SearchableEntities | keyof DB): keyof DB {
  console.log(type);
  if (type === "images" || type === "map_images") return "images";
  return type;
}
