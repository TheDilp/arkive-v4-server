import { app } from "..";
import { EventType } from "../enums/websocketEnums";

export function sendNotification(
  room: string,
  notification: {
    event_type: EventType;
    message: string;
    entity: string;
  },
) {
  console.log(app.server.publish, room, notification);
  app.server.publish(`notifications/${room}`, JSON.stringify(notification));
}
