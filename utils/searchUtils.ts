import { ExpressionBuilder } from "kysely";
import { DB } from "kysely-codegen";

import { SearchableEntities } from "../types/requestTypes";

export function getSearchFields(type: SearchableEntities, isGateway?: boolean): string[] {
  const fields = type === "map_images" ? ["images.id"] : [`${type}.id`];
  if (type === "characters") fields.push("full_name", "nickname", "portrait_id");
  else if (type === "tags") fields.push("title", "color");
  else if (type === "nodes") fields.push("label", "nodes.parent_id", "nodes.image_id");
  else if (type === "edges") fields.push("label", "edges.parent_id");
  else if (type === "map_images") fields.push("images.title");
  else fields.push(`${type}.title`);

  if (type === "documents") fields.push("documents.image_id");
  if (type === "maps") fields.push("maps.image_id");
  if (type === "events") fields.push("events.parent_id");
  if (type === "map_pins") fields.push("map_pins.parent_id", "map_pins.icon", "map_pins.image_id");
  if (type === "words") fields.push("words.parent_id");
  if (type === "blueprints") fields.push("blueprints.icon");
  if (type === "dictionaries") fields.push("dictionaries.icon");
  if (type === "blueprint_instances") fields.push("blueprint_instances.parent_id");

  if (!isGateway) {
    if (type !== "blueprint_instances" && type !== "map_pins" && type !== "events") {
      fields.push(`${type}.project_id`);
    } else if (type === "blueprint_instances") fields.push("blueprints.project_id");
    else if (type === "map_pins") fields.push("maps.project_id");
    else if (type === "events") fields.push("calendars.project_id");
  }

  return fields;
}

export function getSearchWhere(
  eb: ExpressionBuilder<DB, keyof DB>,
  type: SearchableEntities,
  search_term: string,
  project_id: string,
) {
  if (type === "characters") {
    return eb.or([eb("full_name", "ilike", `%${search_term}%`), eb("nickname", "ilike", `%${search_term}%`)]);
  }
  if (type === "edges") {
    return eb.and([eb("label", "ilike", `%${search_term}%`), eb("graphs.project_id", "=", project_id)]);
  }
  if (type === "nodes") {
    return eb.and([
      eb.or([eb("nodes.label", "ilike", `%${search_term}%`), eb("characters.first_name", "ilike", `%${search_term}%`)]),
      eb("graphs.project_id", "=", project_id),
    ]);
  }
  if (type === "map_images") {
    return eb.and([eb("images.title", "ilike", `%${search_term}%`), eb("images.type", "=", "map_images")]);
  }
  return eb(`${type}.title`, "ilike", `%${search_term}%`);
}
