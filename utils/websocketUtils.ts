import { app } from "..";
import { EventType } from "../enums/websocketEnums";

export function sendNotification(
  room: string,
  notification:
    | {
        event_type: EventType;
        entity_id?: string;
        message: string;
        entity: string;
        image_id?: string | null;
        userId: string;
        nickname?: string;
        userImageUrl?: string;
        notification_type: string;
      }
    | {
        entity_id: string;
        event_type: "ROLE_UPDATED" | "ROLE_ASSIGNED";
      },
) {
  if (app?.server) app?.server?.publish(`notifications/${room}`, JSON.stringify(notification));
}
