import { t } from "elysia";

export const ReadNotificationSchema = t.Object({
  data: t.Object({
    user_id: t.String(),
    notification_id: t.String(),
  }),
});
export const ReadAllNotificationsSchema = t.Object({
  data: t.Object({
    user_id: t.String(),
    notification_id: t.String(),
  }),
});
