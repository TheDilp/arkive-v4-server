import { db } from "../database/db";
import { SubEntityEnum, UserNotificationEntitiesEnum } from "../enums";
import { AvailableEntityType, AvailableSubEntityType } from "../types/entityTypes";
import { AfterHandlerActionType } from "../types/requestTypes";
import { redisClient } from "../utils/redisClient";
import {
  decodeUserJwt,
  getAfterHandlerActionFromType,
  getEntityFromPath,
  getOperationFromPath,
  getParentEntity,
} from "../utils/requestUtils";
import { getCharacterFullName, getSingularEntityType } from "../utils/transform";
import { sendNotification } from "../utils/websocketUtils";

export async function afterHandler(
  data: {
    is_folder?: boolean | null;
    title?: string | null;
    image_id?: string | null;
    project_id: string;
  },
  entity: string,
  token: string,
  action: AfterHandlerActionType,
) {
  const { is_folder, project_id, title, image_id } = data || {};

  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { name, auth_id, image_url } = decodeUserJwt(jwt);
    if (project_id) {
      const entityName = title;
      sendNotification(project_id, {
        event_type: "NEW_NOTIFICATION",
        message: `${name || "User"} ${getAfterHandlerActionFromType(action)} a ${getSingularEntityType(entity)} ${
          is_folder ? "folder" : ""
        } - "${entityName}"`,
        entity,
        image_id,
        userId: auth_id,
        nickname: name,
        userImageUrl: image_url,
        notification_type: `${entity}_${action}_notification`,
      });
    }
  }
}

export async function afterHandlerMany(entity: string, token: string, action: AfterHandlerActionType) {
  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { name, auth_id, image_url, project_id } = decodeUserJwt(jwt);
    if (project_id) {
      sendNotification(project_id as string, {
        event_type: "NEW_NOTIFICATION",
        message: `${name || "User"} ${getAfterHandlerActionFromType(action)} multiple ${entity.replaceAll("_", "")}.`,
        entity,
        image_id: null,
        userId: auth_id,
        nickname: name,
        userImageUrl: image_url,
        notification_type: `${entity}_${action}_notification`,
      });
    }
  }
}

export async function tempAfterHandle(context: any, response: any) {
  const redis = await redisClient;
  const token = context.request.headers.get("authorization");
  const jwt = token.replace("Bearer ", "");
  const { auth_id } = decodeUserJwt(jwt);

  const redis_flags = await redis.get(`notification_flags_${auth_id}`);
  let flags: Record<string, boolean> = {};
  if (redis_flags) {
    flags = JSON.parse(redis_flags || "{}");
  } else {
    const notification_flags = await db
      .selectFrom("user_project_feature_flags")
      .select(["user_project_feature_flags.feature_flags"])
      .leftJoin("users", "users.id", "user_project_feature_flags.user_id")
      .where("users.auth_id", "=", auth_id)
      .where("project_id", "=", context.permissions.project_id)
      .executeTakeFirst();
    if (notification_flags) {
      await redis.set(`notification_flags_${auth_id}`, JSON.stringify(notification_flags), { EX: 300 });
      flags = notification_flags.feature_flags as Record<string, boolean>;
    }
  }

  const action = getOperationFromPath(context.path, context.request.method);
  if (action && token) {
    // TODO: CHECK FOR NOTIFICATION SETTINGS
    const entity = getEntityFromPath(context.path) as AvailableEntityType | AvailableSubEntityType;

    if (flags && flags?.[`${entity}_${action}_notification`]) {
      if (UserNotificationEntitiesEnum.includes(entity)) {
        if (context.path.includes("bulk")) {
          afterHandlerMany(entity, token, action);
        } else {
          if (action === "create") {
            if (entity === "characters") {
              const { project_id, first_name, last_name, portrait_id: image_id } = context.body.data;
              afterHandler(
                { project_id, title: getCharacterFullName(first_name, undefined, last_name), image_id },
                entity,
                token,
                action,
              );
            } else if (entity === "tags" && context.body.data.length) {
              const { project_id } = context.body.data[0];

              afterHandler({ project_id, title: "" }, entity, token, action);
            } else {
              const project_id = context?.body?.data?.project_id || context?.response?.data?.project_id;
              const title = context?.body?.data?.title || context?.response?.data?.title;
              if (project_id && title) afterHandler({ project_id, title }, entity, token, action);
            }
          } else if (action === "update" || action === "arkive") {
            // @ts-ignore
            let query = db.selectFrom(entity).where(`${entity}.id`, "=", context.params.id);

            if (SubEntityEnum.includes(entity)) {
              // @ts-ignore
              query = query.select([`${entity}.id`, `${entity}.title`]);
              const parentEntity = getParentEntity(entity);
              if (parentEntity) {
                query = query
                  // @ts-ignore
                  .leftJoin(parentEntity, `${parentEntity}.id`, `${entity}.parent_id`)
                  // @ts-ignore
                  .select([`${parentEntity}.project_id`]);
              }
            } else {
              if (entity === "characters") {
                query = query.select(["id", "full_name as title", "project_id", "portrait_id as image_id"]);
              } else {
                query = query.select(["id", "title", "project_id"]);
              }
            }

            const data: any = await query.executeTakeFirstOrThrow();

            afterHandler(data, entity, token, action);
          } else if (action === "delete") {
            const { data } = context.response;
            afterHandler(data, entity, token, action);
          }
        }
      }
    }
  }
  return response;
}
