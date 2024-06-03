import Elysia from "elysia";
import { ReferenceExpression, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import groupBy from "lodash.groupby";
import uniq from "lodash.uniq";

import { db } from "../database/db";
import { checkEntityLevelPermission } from "../database/queries";
import { DBKeys } from "../database/types";
import { EntitiesWithTagsTablesEnum, MessageEnum } from "../enums";
import { MentionEntityType } from "../types/entityTypes";
import { PermissionDecorationType } from "../types/requestTypes";
import { redisClient } from "../utils/redisClient";

type TagColorStatType = Record<string, number>;
type TagEntityStatType = Record<string, { color: string; count: number }>;
type MentionStatType = Record<string, { title: string; entity_type: string; count: number }>;

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

function getFieldsForMentionStats(entity_type: MentionEntityType): SelectExpression<DB, DBKeys>[] {
  if (entity_type === "characters")
    return ["characters.id", "characters.full_name as title", "characters.portrait_id as image_id"];
  if (entity_type === "blueprint_instances") return ["blueprint_instances.id", "blueprint_instances.title", "blueprints.icon"];
  if (entity_type === "documents") return ["documents.id", "documents.title", "documents.icon", "documents.image_id"];
  if (entity_type === "maps") return ["maps.id", "maps.title", "maps.image_id"];
  if (entity_type === "map_pins") return ["map_pins.id", "map_pins.title", "map_pins.icon", "map_pins.image_id"];
  if (entity_type === "graphs") return ["graphs.id", "graphs.title", "graphs.icon"];
  if (entity_type === "events") return ["events.id", "events.title", "events.parent_id", "events.image_id"];
  if (entity_type === "words") return ["words.id", "words.title", "words.parent_id"];
  return [];
}

export function stats_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/stats", (server) =>
      server.get("/:project_id", async ({ params, permissions }) => {
        const redis = await redisClient;
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

          const tag_entity_stats: TagEntityStatType = {};
          const tag_colors_stats: TagColorStatType = {};

          tag_colors.forEach((tag) => {
            tag_colors_stats[tag.color] = Number(tag.count);
          });

          entities_by_tag_name.forEach((tag) => {
            if (tag.title && tag.color && tag.count) {
              if (tag_entity_stats[tag.title]) {
                tag_entity_stats[tag.title] = {
                  color: tag.color,
                  count: tag_entity_stats[tag.title].count + Number(tag.count),
                };
              } else {
                tag_entity_stats[tag.title] = { color: tag.color, count: Number(tag.count) };
              }
            }
          });

          const project_stats: Record<string, number | TagEntityStatType | TagColorStatType | MentionStatType> = {};

          res.forEach((i) => {
            if (i?.entity) project_stats[i?.entity] = i?.count;
          });

          //! CLEAR CACHE BUST ON TOP OF ROUTE BEFORE COMMIT
          const mentions = await db
            .selectFrom("document_mentions")
            .leftJoin("documents", "documents.id", "document_mentions.parent_document_id")
            .select(["mention_id", "document_mentions.mention_type", (eb) => eb.fn.count<number>("mention_id").as("count")])
            .where("documents.project_id", "=", params.project_id)
            .groupBy(["mention_id", "document_mentions.mention_type"])
            .orderBy("count desc")
            .limit(15)
            .execute();

          const grouped_mentions = groupBy(mentions, "mention_type");
          const mention_queries = Object.entries(grouped_mentions).map(([entity, mentions]) => {
            const ids = uniq(mentions.map((m) => m.mention_id));
            let query = db
              .selectFrom(entity as DBKeys)
              .select(getFieldsForMentionStats(entity as MentionEntityType))
              .where(`${entity}.id` as ReferenceExpression<DB, DBKeys>, "in", ids);

            if (entity === "blueprint_instances") {
              query = query.leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id");
            } else if (entity === "map_pins") {
              query = query.leftJoin("maps", "maps.id", "map_pins.parent_id");
            } else if (entity === "events") {
              query = query.leftJoin("calendars", "calendars.id", "events.parent_id");
            } else if (entity === "words") {
              query = query.leftJoin("dictionaries", "dictionaries.id", "words.parent_id");
            }

            if (!permissions.is_project_owner) {
              query = checkEntityLevelPermission(query, permissions, entity);
            }

            return query;
          });
          const mention_res = await Promise.all(mention_queries.map((q) => q.execute()));

          const mention_res_with_count: MentionStatType = {};

          mention_res.flat().forEach((m) => {
            const mention = mentions.find((ment) => ment.mention_id === m.id);
            if (m.id && m.title && typeof mention?.count === "string")
              mention_res_with_count[m.id] = {
                title: m.title,
                count: Number(mention.count),
                entity_type: mention.mention_type,
                icon: m?.icon,
                image_id: m?.image_id,
              };
          });

          project_stats["tag_colors"] = tag_colors_stats;
          project_stats["tag_entities"] = tag_entity_stats;
          project_stats["mentions"] = mention_res_with_count;

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
