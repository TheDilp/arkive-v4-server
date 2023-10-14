import { getCharacterFullName, getSingularEntityType } from "../utils/transform";
import { sendNotification } from "../utils/websocketUtils";

export function afterCreateHanlder(
  args: {
    body: { data: { title?: string; label?: string; first_name?: string; last_name?: string | null; project_id: string } };
  },
  entity: string,
) {
  const { project_id, title, label, first_name, last_name } = args.body.data;
  if (project_id) {
    const entityName = first_name ? getCharacterFullName(first_name, undefined, last_name) : title || label;
    sendNotification(project_id, {
      event_type: "NEW_NOTIFICATION",
      message: `User created a new ${getSingularEntityType(entity)} - "${entityName}"`,
      entity,
    });
  }
}
