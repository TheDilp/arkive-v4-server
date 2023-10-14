import { getCharacterFullName, getSingularEntityType } from "../utils/transform";
import { sendNotification } from "../utils/websocketUtils";

export function afterUpdateHandler(
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
) {
  const { is_folder, project_id, title, label, first_name, last_name, image_id } = data;
  if (project_id) {
    const entityName = first_name ? getCharacterFullName(first_name, undefined, last_name) : title || label;
    sendNotification(project_id, {
      event_type: "NEW_NOTIFICATION",
      message: `User updated a ${getSingularEntityType(entity)} ${is_folder ? "folder" : ""} - "${entityName}"`,
      image_id,
      entity,
    });
  }
}
