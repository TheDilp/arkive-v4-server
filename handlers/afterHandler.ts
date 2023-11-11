import { AfterHandlerActionType } from "../types/requestTypes";
import { decodeUserJwt, getAfterHandlerActionFromType } from "../utils/requestUtils";
import { getCharacterFullName, getSingularEntityType } from "../utils/transform";
import { sendNotification } from "../utils/websocketUtils";

export async function afterHandler(
  data: {
    is_folder?: boolean | null;
    title?: string;
    label?: string;
    image_id?: string | null;
    first_name?: string;
    last_name?: string | null;
    project_id: string;
  },
  entity: string,
  token: string,
  action: AfterHandlerActionType,
) {
  const { is_folder, project_id, title, label, first_name, last_name, image_id } = data;

  if (token) {
    const jwt = token.replace("Bearer ", "");
    const { name, auth_id, image_url } = decodeUserJwt(jwt);
    if (project_id) {
      const entityName = first_name ? getCharacterFullName(first_name, undefined, last_name) : title || label;
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
      });
    }
  }
}
