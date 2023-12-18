import { db } from "../database/db";
import { UserNotificationEntities } from "../enums";
import { AvailableEntityType, AvailableSubEntityType } from "../types/entityTypes";
import { AfterHandlerActionType } from "../types/requestTypes";
import { decodeUserJwt, getAfterHandlerActionFromType, getEntityFromPath, getOperationFromPath } from "../utils/requestUtils";
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
          const { project_id, first_name, last_name } = context.body.data;
          afterHandler({ project_id, title: getCharacterFullName(first_name, undefined, last_name) }, entity, token, action);
        } else {
          const { project_id, title } = context.body.data;
          afterHandler({ project_id, title }, entity, token, action);
        }
      } else if (action === "update") {
        const data = await db
          .selectFrom(entity)
          .where("id", "=", context.params.id)
          .select(entity === "characters" ? ["id", "full_name as title", "project_id"] : ["id", "title", "project_id"])
          .executeTakeFirstOrThrow();
        afterHandler(data, entity, token, action);
      } else if (action === "delete") {
        const { data } = context.response;
        afterHandler(data, entity, token, action);
      }
    }
  }
  return response;
}
