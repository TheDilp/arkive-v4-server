import { Elysia, t } from "elysia";

import { app as mainApp } from "..";
import { db } from "../database/db";
import { ErrorEnums, UnauthorizedError } from "../enums";
import { redisClient } from "../utils/redisClient";
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
          query: t.Object({ character_id: t.String(), user_id: t.String() }),
          body: t.Union([
            t.Object({
              type: t.Literal("message"),
              data: t.Intersect([
                t.Object({
                  id: t.String(),
                  parent_id: t.String(),
                  sender_id: t.Optional(t.Union([t.Null(), t.String()])),
                  content: t.Any(),
                }),

                t.Union([
                  t.Object({
                    type: t.Literal("character"),
                    full_name: t.Union([t.String(), t.Null()]),
                    portrait_id: t.Union([t.String(), t.Null()]),
                  }),
                  t.Object({
                    type: t.Union([t.Literal("narration"), t.Literal("place")]),
                  }),
                ]),
              ]),
              project_id: t.String(),
              conversation: t.Object({ id: t.Optional(t.String()), title: t.Optional(t.String()) }),
            }),
            t.Object({
              type: t.Literal("presence"),
              data: t.Object({
                character_id: t.String(),
                user_id: t.String(),
              }),
            }),
          ]),
          async beforeHandle({ cookie: { access, refresh }, set }) {
            const data = await verifyJWT({ access, refresh, set });
            if (data.status !== "authenticated") return false;
          },

          async open(ws) {
            const { user_id, character_id } = ws.data.query;

            const { conversation_id } = ws.data.params;
            if (conversation_id) {
              ws.subscribe(conversation_id);
              if (user_id) {
                const redis = await redisClient;
                const presence = await redis.get(`conversation-${conversation_id}`);
                if (presence) {
                  try {
                    const presence_data: Record<string, string | null> = JSON.parse(presence);
                    if (character_id && character_id !== "null") {
                      const new_presence_data = { ...presence_data };

                      if (!new_presence_data[character_id]) new_presence_data[character_id] = user_id;
                      const string_presence_data = JSON.stringify(new_presence_data);
                      redis.set(`conversation-${conversation_id}`, string_presence_data);
                      redis.expire(`conversation-${conversation_id}`, 86400);
                      ws.publish(conversation_id, { event_type: "CONVERSATION_PRESENCE", message: string_presence_data });
                    } else {
                      const string_presence_data = JSON.stringify(presence_data);
                      mainApp?.server?.publish(
                        conversation_id,
                        JSON.stringify({
                          event_type: "CONVERSATION_PRESENCE",
                          message: string_presence_data,
                        }),
                      );
                    }
                  } catch (error) {
                    console.error(error);
                    return;
                  }
                } else {
                  if (character_id && character_id !== "null") {
                    const presence_data = { [character_id]: user_id };
                    const string_presence_data = JSON.stringify(presence_data);

                    redis.set(`conversation-${conversation_id}`, string_presence_data);
                    redis.expire(`conversation-${conversation_id}`, 86400);
                    mainApp?.server?.publish(
                      conversation_id,
                      JSON.stringify({
                        event_type: "CONVERSATION_PRESENCE",
                        message: string_presence_data,
                      }),
                    );
                  }
                }
              }
            } else {
              ws.close();
            }
          },
          async close(ws) {
            const { conversation_id } = ws.data.params;
            const { user_id, character_id } = ws.data.query;
            if (user_id) {
              const redis = await redisClient;
              const presence = await redis.get(`conversation-${conversation_id}`);
              if (presence) {
                try {
                  const presence_data: Record<string, string | null> = JSON.parse(presence);
                  if (character_id && character_id !== "null") {
                    const new_presence_data = { ...presence_data };

                    if (new_presence_data[character_id]) delete new_presence_data[character_id];
                    const string_presence_data = JSON.stringify(new_presence_data);
                    redis.set(`conversation-${conversation_id}`, string_presence_data);
                    redis.expire(`conversation-${conversation_id}`, 86400);
                    mainApp?.server?.publish(
                      conversation_id,
                      JSON.stringify({
                        event_type: "CONVERSATION_PRESENCE",
                        message: string_presence_data,
                      }),
                    );
                  } else {
                    const string_presence_data = JSON.stringify(presence_data);
                    mainApp?.server?.publish(
                      conversation_id,
                      JSON.stringify({
                        event_type: "CONVERSATION_PRESENCE",
                        message: string_presence_data,
                      }),
                    );
                  }
                } catch (error) {
                  console.error(error);
                  return;
                }
              } else {
                if (character_id && character_id !== "null") {
                  const presence_data = { [character_id]: user_id };
                  const string_presence_data = JSON.stringify(presence_data);

                  redis.set(`conversation-${conversation_id}`, string_presence_data);
                  redis.expire(`conversation-${conversation_id}`, 86400);
                  mainApp?.server?.publish(
                    conversation_id,
                    JSON.stringify({
                      event_type: "CONVERSATION_PRESENCE",
                      message: string_presence_data,
                    }),
                  );
                }
              }
            }
          },
          async message(ws, message) {
            const { conversation_id } = ws.data.params;

            if (message.type === "message") {
              if (conversation_id && mainApp?.server) {
                try {
                  if (message.data.content.length === 0) {
                    return;
                  }
                  await db
                    .insertInto("messages")
                    .values({
                      content: message.data.content,
                      sender_id: message.data.sender_id,
                      parent_id: message.data.parent_id,
                      type: message.data.type,
                    })
                    .execute();
                  mainApp.server.publish(
                    conversation_id,
                    JSON.stringify({
                      event_type: "NEW_MESSAGE",
                      message: JSON.stringify(message.data),
                    }),
                  );

                  ws.publish(
                    `notifications/${message.project_id}`,
                    JSON.stringify({
                      event_type: "NEW_NOTIFICATION",
                      message: `User sent a message in conversation ${
                        message.conversation?.title ? `"${message.conversation.title}"` : ""
                      }`,
                      conversation_id,
                      entity: "conversations",
                    }),
                  );
                } catch (error) {
                  console.error("WEBSOCKET PUBLISH ERROR:", error);
                }
              }
            } else if (message.type === "presence") {
              const redis = await redisClient;

              const presence_string = await redis.get(`conversation-${conversation_id}`);

              if (presence_string) {
                try {
                  const presence: Record<string, string> = JSON.parse(presence_string);

                  if (!presence[message.data.character_id]) {
                    const temp = { ...presence };
                    temp[message.data.character_id] = message.data.user_id;

                    const string_presence_data = JSON.stringify(temp);
                    mainApp?.server?.publish(
                      conversation_id,
                      JSON.stringify({
                        event_type: "NEW_MESSAGE",
                        message: string_presence_data,
                      }),
                    );

                    redis.set(`conversation-${conversation_id}`, string_presence_data);
                    redis.expire(`conversation-${conversation_id}`, 86400);
                  }
                } catch (error) {
                  console.error(error);
                }
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
