import Elysia from "elysia";

import { db } from "../database/db";
import { InsertMessageSchema } from "../database/validation";

export function websocket_router(app: Elysia) {
  return app
    .ws("/ws/conversation/:conversation_id", {
      body: InsertMessageSchema,
      open(ws) {
        const { conversation_id } = ws.data.params;
        if (conversation_id) {
          console.log(conversation_id);
          ws.subscribe(conversation_id);
        } else {
          ws.close();
        }
      },
      async message(ws, message) {
        const { conversation_id } = ws.data.params;
        if (conversation_id) {
          try {
            await db.insertInto("messages").values(message.data).execute();
            app.server.publish(
              conversation_id,
              JSON.stringify({
                event_type: "NEW_MESSAGE",
                message: JSON.stringify(message.data),
              }),
            );
          } catch (error) {
            console.log("error");
          }
        }
      },
      close() {
        console.log("CLOSED");
      },
    })
    .ws("/ws/notifications/:project_id", {
      open(ws) {
        const { project_id } = ws.data.params;
        if (project_id) {
          ws.subscribe(`notifications/${project_id}`);
        }
        console.log("OPEN NOTIFICATIONS");
      },
    });
}
