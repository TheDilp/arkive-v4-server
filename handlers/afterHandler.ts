import { db } from "../database/db";
import { SubEntityEnum, UserNotificationEntities } from "../enums";
import { AvailableEntityType, AvailableSubEntityType } from "../types/entityTypes";
import { AfterHandlerActionType } from "../types/requestTypes";
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
  const { is_folder, project_id, title, image_id } = data;

  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { name, auth_id, image_url } = decodeUserJwt(jwt);
    if (project_id) {
      const entityName = title;
      sendNotification(project_id, {
        event_type: "NEW_NOTIFICATION",
        message: `${name || "User"} ${getAfterHandlerActionFromType(action)} ${
          action !== "delete_many" ? getSingularEntityType(entity) : entity.replaceAll("_", " ")
        } ${is_folder ? "folder" : ""} - "${entityName}"`,
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

export async function tempAfterHandle(context: any, response: any) {
  const action = getOperationFromPath(context.path, context.request.method);
  const token = context.request.headers.get("authorization");
  if (action && token) {
    const entity = getEntityFromPath(context.path) as AvailableEntityType | AvailableSubEntityType;
    if (UserNotificationEntities.includes(entity)) {
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
      } else if (action === "update") {
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
  return response;
}
