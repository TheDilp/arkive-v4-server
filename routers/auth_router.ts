import { WebhookEvent } from "@clerk/clerk-sdk-node";
import Elysia from "elysia";
import { Webhook } from "svix";

import { db } from "../database/db";
import { UserCreateSchema } from "../database/validation/auth";
import { MessageEnum } from "../enums";

export function auth_router(app: Elysia) {
  return app.group("/auth", (server) =>
    server.post(
      "/create",
      async ({ body, headers, set }) => {
        const WEBHOOK_SECRET = process.env.WH_CREATE_USER_SECRET;

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

        if (eventType === "user.created") {
          const email = body.data.email_addresses[0].email_address;
          const { username } = body.data;
          const image = body.data.profile_image_url || body.data.image_url;

          await db.insertInto("users").values({ username, email, image }).execute();
          return { message: MessageEnum.success, ok: true };
        } else {
          set.status = "Internal Server Error";
          return { message: "WRONG EVENT TYPE", ok: false };
        }
      },
      {
        body: UserCreateSchema,
      },
    ),
  );
}
