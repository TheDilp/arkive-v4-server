import { Elysia, t } from "elysia";
import { sign } from "tweetnacl";

import { db } from "../database/db";
import { PermissionDecorationType } from "../types/requestTypes";
import { chooseRandomTableItems } from "../utils/utils";

export function interaction_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/interactions", (server) => {
      return server.post(
        "/interaction",
        async ({ body, headers, set }) => {
          if (headers) {
            const signature = headers?.["x-signature-ed25519"];
            const timestamp = headers?.["x-signature-timestamp"];

            if (signature && timestamp) {
              const PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY;

              const isVerified = sign.detached.verify(
                Buffer.from(timestamp + JSON.stringify(body)),
                Buffer.from(signature, "hex"),
                Buffer.from(PUBLIC_KEY as string, "hex"),
              );

              if (!isVerified) {
                set.status = 401;

                return "Invalid request signature";
              }
              if (body.type === 1) {
                set.status = 200;
                return JSON.stringify({ type: 1 });
              }

              const [type, id] = body.data.custom_id.split("_");

              if (type === "roll-btn") {
                const { url } = await db
                  .selectFrom("webhooks")
                  .select(["url"])
                  .where("webhooks.webhook_id", "=", body.message.webhook_id)
                  .executeTakeFirstOrThrow();

                const data = await db
                  .selectFrom("random_table_options")
                  .select(["id", "title", "description"])
                  .where("parent_id", "=", id)
                  .execute();
                if (data.length) {
                  const random_option = chooseRandomTableItems(data, 1);

                  if (random_option) {
                    const content = {
                      title: random_option[0].title,
                      description: random_option[0].description,
                    };

                    fetch(`https://discordapp.com/api/channels/${body.message.channel_id}/messages/${body.message.id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                      },
                    });

                    await fetch(url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        embeds: [content],
                      }),
                    });
                  }
                }
              }
              set.status = 200;
              return { type: 3 };
            }
            set.status = 401;

            return "Invalid request signature";
          }
          return "Invalid request signature";
        },
        {
          body: t.Record(t.String(), t.Any()),
        },
      );
    });
}
