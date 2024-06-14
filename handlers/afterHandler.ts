import { RedisClientType } from "redis";

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
import { getCharacterFullName, getSingularEntityType } from "../utils/utils";
import { sendNotification } from "../utils/websocketUtils";

export async function afterHandler(
  data: {
    id?: string;
    is_folder?: boolean | null;
    title?: string | null;
    image_id?: string | null;
    parent_id?: string | null;
    project_id: string;
  },
  entity: string,
  token: string,
  action: AfterHandlerActionType,
  redis?: RedisClientType<any, any, any>,
) {
  const { is_folder, project_id, title, image_id, parent_id } = data || {};

  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { name, auth_id, image_url, user_id } = decodeUserJwt(jwt);
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
      if (redis) redis.del(`${project_id}_stats`);
    }
    if (data?.id)
      db.insertInto("notifications")
        .values({
          entity_type: entity,
          title: data.title || "NO TITLE",
          action,
          parent_id: parent_id || null,
          user_name: name,
          image_id,
          user_image: image_url,
          user_id: user_id as string,
          project_id: project_id as string,
          related_id: data.id,
        })
        .execute();
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
  const action = getOperationFromPath(context.path, context.request.method);

  if (action && token) {
    const entity = getEntityFromPath(context.path) as AvailableEntityType | AvailableSubEntityType;

    if (UserNotificationEntitiesEnum.includes(entity)) {
      if (context.path.includes("bulk")) {
        afterHandlerMany(entity, token, action);
      } else {
        if (action === "create") {
          if (entity === "characters") {
            const { id } = context.response.data;
            const { project_id, first_name, last_name, portrait_id: image_id } = context.body.data;
            afterHandler(
              { id, project_id, title: getCharacterFullName(first_name, undefined, last_name), image_id },
              entity,
              token,
              action,
              redis,
            );
          } else if (entity === "tags") {
            const { project_id } = context.body.data[0];

            const tags = context.response.data;

            for (let index = 0; index < tags.length; index += 1) {
              if (tags[index].id) {
                afterHandler({ id: tags[index].id, project_id, title: tags[index].title }, entity, token, action, redis);
              }
            }
          } else {
            const { id } = context.response.data;

            const project_id = context?.body?.data?.project_id || context?.response?.data?.project_id;
            const title = context?.body?.data?.title || context?.response?.data?.title;
            if (project_id && title) afterHandler({ id, project_id, title }, entity, token, action, redis);
          }
        } else if (action === "update" || action === "arkive") {
          // @ts-ignore
          let query = db.selectFrom(entity).where(`${entity}.id`, "=", context.params.id);

          if (SubEntityEnum.includes(entity)) {
            // @ts-ignore
            query = query.select([`${entity}.id`, `${entity}.title`, `${entity}.parent_id`]);
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

          afterHandler(data, entity, token, action, redis);
        } else if (action === "delete") {
          const { data } = context.response;
          afterHandler(data, entity, token, action, redis);
        }
      }
    }
  }
  return response;
}
