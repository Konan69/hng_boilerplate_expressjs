import {
  createNotifications,
  deleteAllUserNotification,
  getAllUnreadNotifications,
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, validateData } from "../middleware";
import { notificationParamsSchema, paramsSchema } from "../schemas/params";
import { markAsRead, notificationSchema } from "../schemas/notification";

const notificationsRoute = Router();

notificationsRoute.get(
  "/notifications/read",
  authMiddleware,
  markAllNotificationAsRead,
);

notificationsRoute.get(
  "/notifications/unread",
  authMiddleware,
  getAllUnreadNotifications,
);

notificationsRoute.post(
  "/notifications/create",
  authMiddleware,
  validateData({ body: notificationSchema }),
  createNotifications,
);

notificationsRoute.delete(
  "/notifications/clear",
  authMiddleware,
  deleteAllUserNotification,
);

notificationsRoute.patch(
  "/notifications/read",
  authMiddleware,
  markAllNotificationAsRead,
);

notificationsRoute.get(
  "/notifications/:user_id",
  authMiddleware,
  validateData({ params: paramsSchema }),
  getNotifications,
);

notificationsRoute.patch(
  "/notifications/read/:notification_id",
  authMiddleware,
  validateData({ params: notificationParamsSchema, body: markAsRead }),
  markNotificationAsRead,
);

export { notificationsRoute };
