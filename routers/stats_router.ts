import Elysia from "elysia";

import { db } from "../database/db";
import { DBKeys } from "../database/types";
import { EntitiesWithTagsTablesEnum, MessageEnum } from "../enums";
import { redisClient } from "../utils/redisClient";

const mainEntities = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "map_pins",
  "graphs",
  "nodes",
  "calendars",
  "events",
  "dictionaries",
  "words",
  "random_tables",
  "tags",
  "images",
];

export function stats_router(app: Elysia) {
  return app.group("/stats", (server) =>
    server.get("/:project_id", async ({ params }) => {
      const redis = await redisClient;
      await redis.del(`${params.project_id}_stats`);
      const project_stats: string | null = await redis.get(`${params.project_id}_stats`);
      if (!project_stats) {
        const queries = mainEntities.map((ent) => {
          if (ent === "blueprint_instances")
            return db
              .selectFrom("blueprint_instances")
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprints.project_id", "=", params.project_id)
              .select([(eb) => eb.val("blueprint_instances").as("entity"), (eb) => eb.fn.countAll<number>().as("count")]);
          if (ent === "map_pins")
            return db
              .selectFrom("map_pins")
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .where("maps.project_id", "=", params.project_id)
              .select([(eb) => eb.val("map_pins").as("entity"), (eb) => eb.fn.countAll<number>().as("count")]);
          if (ent === "nodes")
            return db
              .selectFrom("nodes")
              .leftJoin("graphs", "graphs.id", "nodes.parent_id")
              .where("graphs.project_id", "=", params.project_id)
              .select([(eb) => eb.val("nodes").as("entity"), (eb) => eb.fn.countAll<number>().as("count")]);
          if (ent === "events")
            return db
              .selectFrom("events")
              .leftJoin("calendars", "calendars.id", "events.parent_id")
              .where("calendars.project_id", "=", params.project_id)
              .select([(eb) => eb.val("events").as("entity"), (eb) => eb.fn.countAll<number>().as("count")]);
          if (ent === "words")
            return db
              .selectFrom("words")
              .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
              .where("dictionaries.project_id", "=", params.project_id)
              .select([(eb) => eb.val("words").as("entity"), (eb) => eb.fn.countAll<number>().as("count")]);
          return db
            .selectFrom(ent as DBKeys)
            .select([(eb) => eb.val(ent).as("entity"), (eb) => eb.fn.countAll<number>().as("count")])
            .where("project_id", "=", params.project_id);
        });

        const res = await Promise.all(queries.map((q) => q.executeTakeFirst()));

        const tag_colors = await db
          .selectFrom("tags")
          .groupBy("color")
          .select(["color", (eb) => eb.fn.count<number>("color").as("count")])
          .where("project_id", "=", params.project_id)
          .execute();

        let query = db
          .selectFrom(EntitiesWithTagsTablesEnum[0])
          .leftJoin("tags", "tags.id", EntitiesWithTagsTablesEnum[0] === "image_tags" ? "tag_id" : "B")
          .select([
            "tags.title",
            "tags.color",
            EntitiesWithTagsTablesEnum[0] === "image_tags"
              ? (eb) => eb.fn.countAll<number>().as("count")
              : (eb) => eb.fn.countAll<number>().as("count"),
          ])
          .groupBy(["tags.title", "tags.color"])
          .where("tags.project_id", "=", params.project_id)
          .orderBy("count desc");

        for (let index = 1; index < EntitiesWithTagsTablesEnum.length; index += 1) {
          const table = EntitiesWithTagsTablesEnum[index];
          query = query
            // @ts-ignore
            .union(
              db
                .selectFrom(table)
                .leftJoin("tags", "tags.id", table === "image_tags" ? "tag_id" : "B")
                .groupBy(["title", "color"])
                .select([
                  "tags.title",
                  "tags.color",
                  table === "image_tags"
                    ? (eb) => eb.fn.countAll<number>().as("count")
                    : (eb) => eb.fn.countAll<number>().as("count"),
                ])
                .where("project_id", "=", params.project_id),
            );
        }

        const entities_by_tag_name = await query.execute();

        const tag_colors_stats: Record<string, number> = {};
        const tag_entity_stats: Record<string, { color: string; count: number }> = {};

        tag_colors.forEach((tag) => {
          tag_colors_stats[tag.color] = Number(tag.count);
        });

        entities_by_tag_name.forEach((tag) => {
          if (tag.title && tag.color && tag.count) {
            if (tag_entity_stats[tag.title]) {
              tag_entity_stats[tag.title] = { color: tag.color, count: tag_entity_stats[tag.title].count + Number(tag.count) };
            } else {
              tag_entity_stats[tag.title] = { color: tag.color, count: Number(tag.count) };
            }
          }
        });

        const project_stats: Record<
          string,
          number | Record<string, number> | Record<string, { color: string; count: number }>
        > = {};

        project_stats["tag_colors"] = tag_colors_stats;
        project_stats["tag_entities"] = tag_entity_stats;

        res.forEach((i) => {
          if (i?.entity) project_stats[i?.entity] = i?.count;
        });
        redis.set(`${params.project_id}_stats`, JSON.stringify(project_stats), { EX: 60 * 60 });
        return { data: project_stats, message: MessageEnum.success, ok: true };
      } else {
        try {
          const parsed = JSON.parse(project_stats);
          return { data: parsed, message: MessageEnum.success, ok: true };
        } catch (error) {
          console.error(error);
          return { data: {}, message: "Error", ok: true };
        }
      }
    }),
  );
}
