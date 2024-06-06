import Elysia from "elysia";

// import groupBy from "lodash.groupby";
import { db } from "../database/db";
import { ReadNotificationSchema } from "../database/validation";
import { MessageEnum } from "../enums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function notification_router(app: Elysia) {
  return app.group("notifications", (server) =>
    server
      .get(
        "/:project_id/:user_id",
        async ({ params }) => {
          const data = await db
            .selectFrom("notifications")
            .leftJoin("user_notifications", (join) =>
              join.on((jb) =>
                jb.and([
                  jb("notifications.id", "=", jb.ref("user_notifications.notification_id")),
                  jb("user_notifications.user_id", "=", params.user_id),
                ]),
              ),
            )
            .select([
              "notifications.id",
              "notifications.created_at",
              "notifications.title",
              "notifications.user_id",
              "notifications.user_image",
              "notifications.user_name",
              "notifications.entity_type",
              "notifications.image_id",
              "notifications.parent_id",
              "notifications.project_id",
              "notifications.action",
              "notifications.related_id",
            ])
            .orderBy("created_at", "desc")
            .limit(100)
            .where("user_notifications.is_read", "is", null)
            .where("notifications.user_id", "!=", params.user_id)
            .where("notifications.project_id", "=", params.project_id)
            .execute();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/read",
        async ({ body }) => {
          await db
            .insertInto("user_notifications")
            .values({ user_id: body.data.user_id, notification_id: body.data.notification_id, is_read: true })
            .execute();
          return { message: "Success", ok: true, role_access: true };
        },
        {
          response: ResponseSchema,
          body: ReadNotificationSchema,
        },
      ),
  );
}
