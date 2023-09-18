import { DB } from "kysely-codegen";

export function getSearchTableFromType(type: "map_images" | keyof DB): keyof DB {
  if (type === "images" || type === "map_images") return "images";
  return type;
}
