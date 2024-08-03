import { Elysia } from "elysia";

import { db } from "../database/db";
import { ErrorEnums, UnauthorizedError } from "../enums";
import { WebsocketConversationMessage } from "../types/websocketTypes";
import { verifyJWT } from "../utils/userUtils";

export function websocket_router(server: Elysia) {
  return server.guard(
    {
      type: "none",
      beforeHandle: async ({ set, cookie: { access, refresh } }) => {
        const verified = await verifyJWT({ access, refresh, set });

        if (verified) return;

        throw new UnauthorizedError(ErrorEnums.unauthorized);
      },
    },
    (app) =>
      app
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
            const typedMessage = message as WebsocketConversationMessage;
            if (conversation_id && app.server) {
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
                console.error("WEBSOCKET PUBLISH ERROR:", error);
              }
            }
          },
        })
        .ws("/ws/notifications/:project_id", {
          async open(ws) {
            const { project_id } = ws.data.params;
            if (project_id) {
              ws.subscribe(`notifications/${project_id}`);
            }
          },
        }),
  );
}
