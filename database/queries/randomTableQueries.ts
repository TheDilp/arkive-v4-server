import { SelectQueryBuilder, sql } from "kysely";
import { DB } from "kysely-codegen";

export function getRandomTableOptionRelatedData(eb: SelectQueryBuilder<DB, "random_table_options", Record<any, any>>) {
  return eb
    .leftJoin("characters", "characters.id", "random_table_options.character_id")
    .leftJoin("blueprint_instances", "blueprint_instances.id", "random_table_options.blueprint_instance_id")
    .leftJoin("documents", "documents.id", "random_table_options.document_id")
    .leftJoin("maps", "maps.id", "random_table_options.map_id")
    .leftJoin("map_pins", "map_pins.id", "random_table_options.map_pin_id")
    .leftJoin("graphs", "graphs.id", "random_table_options.graph_id")
    .leftJoin("events", "events.id", "random_table_options.event_id")
    .leftJoin("words", "words.id", "random_table_options.word_id")
    .leftJoin("images", "images.id", "random_table_options.image_id")
    .select([
      (sb) =>
        sb
          .case()
          .when("random_table_options.character_id", "is not", null)
          .then(
            sql`JSONB_BUILD_OBJECT('id', characters.id, 'title', characters.full_name, 'image_id', characters.portrait_id, 'type', 'characters')`,
          )
          .when("random_table_options.blueprint_instance_id", "is not", null)
          .then(
            sql`JSONB_BUILD_OBJECT('id', blueprint_instances.id, 'title', blueprint_instances.title, 'type', 'blueprint_instances')`,
          )
          .when("random_table_options.document_id", "is not", null)
          .then(
            sql`JSONB_BUILD_OBJECT('id', documents.id, 'title', documents.title, 'image_id', documents.image_id, 'icon', documents.icon, 'type', 'documents')`,
          )
          .when("random_table_options.map_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', maps.id, 'title', maps.title, 'image_id', maps.image_id, 'type', 'maps')`)
          .when("random_table_options.map_pin_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', map_pins.id, 'title', map_pins.title, 'icon', map_pins.icon, 'type', 'map_pins')`)
          .when("random_table_options.graph_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', graphs.id, 'title', graphs.title, 'icon', graphs.icon, 'type', 'graphs')`)
          .when("random_table_options.event_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', events.id, 'title', events.title, 'type', 'events')`)
          .when("random_table_options.word_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', words.id, 'title', words.title, 'type', 'words')`)
          .when("random_table_options.image_id", "is not", null)
          .then(sql`JSONB_BUILD_OBJECT('id', images.id, 'title', images.title, 'image_id', images.id, 'type', 'images')`)
          .end()
          .as("related_data"),
    ]);
}
