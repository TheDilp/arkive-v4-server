import { db } from "../database/db";
import { redisClient } from "./redisClient";

export async function getUserProjectFlags(user_id: string, project_id: string) {
  const redis = await redisClient;
  const redis_flags = await redis.get(`notification_flags_${user_id}`);
  let flags: Record<string, boolean> = {};
  if (redis_flags) {
    flags = JSON.parse(redis_flags || "{}");
  } else {
    const notification_flags = await db
      .selectFrom("user_project_feature_flags")
      .select(["user_project_feature_flags.feature_flags"])
      .leftJoin("users", "users.id", "user_project_feature_flags.user_id")
      .where("users.id", "=", user_id)
      .where("project_id", "=", project_id)
      .executeTakeFirst();
    if (notification_flags?.feature_flags) {
      await redis.set(`notification_flags_${user_id}`, JSON.stringify(notification_flags.feature_flags), { EX: 60 * 60 });
      flags = notification_flags.feature_flags as Record<string, boolean>;
    }
  }
  return flags;
}
