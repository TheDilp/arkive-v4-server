import { WebhookEvent } from "@clerk/clerk-sdk-node";
import Elysia from "elysia";
import { Webhook } from "svix";

import { db } from "../database/db";
import { AuthSchema } from "../database/validation/auth";
import { MessageEnum } from "../enums";

export function auth_router(app: Elysia) {
  return app.group("/auth", (server) =>
    server.post(
      "/user",
      async ({ body, headers, set }) => {
        const WEBHOOK_SECRET = process.env.WH_USER_SECRET;

        if (!WEBHOOK_SECRET) {
          throw new Error("MISSING WH SECRET");
        }
        const svix_id = headers["svix-id"];
        const svix_timestamp = headers["svix-timestamp"];
        const svix_signature = headers["svix-signature"];
        if (!svix_id || !svix_timestamp || !svix_signature) {
          set.status = "Internal Server Error";
          return { message: "MISSING HEADERS", ok: false };
        }
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: WebhookEvent;

        // Verify the payload with the headers
        try {
          evt = wh.verify(JSON.stringify(body), {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
          }) as WebhookEvent;
        } catch (err) {
          set.status = "Internal Server Error";
          return { message: "COULD NOT VERIFY WEBHOOK", ok: false };
        }

        const eventType = evt.type;
        const email = body.data.email_addresses?.[0]?.email_address;
        const { id: auth_id } = body.data;
        if (eventType === "user.created" && email) {
          const existingUser = await db.selectFrom("users").select(["auth_id"]).where("email", "=", email).executeTakeFirst();
          if (existingUser && !existingUser.auth_id) {
            await db.updateTable("users").where("email", "=", email).set({ auth_id }).execute();
          } else if (!existingUser) {
            await db.insertInto("users").values({ auth_id, email }).execute();
          } else if (existingUser && !!existingUser.auth_id) {
            // do nothing at all
          }
          return { message: MessageEnum.success, ok: true };
        } else if (eventType === "user.updated") {
          await db.updateTable("users").where("auth_id", "=", auth_id).set({ email }).execute();
          return { message: MessageEnum.success, ok: true };
        } else if (eventType === "user.deleted") {
          await db.deleteFrom("users").where("auth_id", "=", auth_id).execute();
          return { message: MessageEnum.success, ok: true };
        } else {
          set.status = "Internal Server Error";
          return { message: "WRONG EVENT TYPE", ok: false };
        }
      },
      {
        body: AuthSchema,
      },
    ),
  );
}
