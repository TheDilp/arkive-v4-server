import Elysia from "elysia";

import { db } from "../database/db";

export function websocket_router(app: Elysia) {
  return app
    .ws("/ws/conversation/:conversation_id", {
      open(ws) {
        const { conversation_id } = ws.data.params;
        if (conversation_id) {
          ws.subscribe(conversation_id);
        } else {
          ws.close();
        }
      },
      async message(ws, message) {
        const { conversation_id } = ws.data.params;
        const typedMessage = message as {
          data: {
            id: string;
            parent_id: string;
            sender_id?: string;
            content: string;
            type: "character" | "narration" | "place";
          };
          project_id: string;
          conversation: { id?: string; title?: string };
        };
        if (conversation_id) {
          try {
            if (typedMessage.data.content.length === 0) {
              return;
            }
            // @ts-ignore
            await db.insertInto("messages").values(typedMessage.data).execute();
            app.server.publish(
              conversation_id,
              JSON.stringify({
                event_type: "NEW_MESSAGE",
                message: JSON.stringify(typedMessage.data),
              }),
            );

            ws.publish(
              `notifications/${typedMessage.project_id}`,
              JSON.stringify({
                event_type: "NEW_NOTIFICATION",
                message: `User sent a message in conversation ${
                  typedMessage.conversation?.title ? `"${typedMessage.conversation.title}"` : ""
                }`,
                conversation_id,
                entity: "conversations",
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
      },
    });
}
