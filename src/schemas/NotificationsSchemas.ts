import { z } from 'zod';

class NotificationsSchemas {
  // Schema for a single notification
  static notificationSchema = z.object({
    idNotification: z.number(),
    icon: z.string().nullable(),
    description: z.string(),
    notificationTime: z.string().nullable(),
    read: z.boolean(),
    createdIn: z.date(),
    updatedIn: z.date().nullable(),
    idUser: z.number(),
  });

  // Schema for adding a notification
  static AddNotification = z.object({
    icon: z.string().min(1, "Icon is required"),
    description: z.string().min(1, "Description is required"),
    idUser: z.number().int().positive("ID User must be a positive integer"),
  });

  // Schema for marking a notification as read
  static ReadNotification = z.object({
    notificationId: z.number().int().positive("Notification ID must be a positive integer"),
  });

  // Schema for deleting a notification
  static DeleteNotification = z.object({
    notificationId: z.number().int().positive("Notification ID must be a positive integer"),
  });

  // Schema for viewing a single notification
  static ViewNotification = z.object({
    notificationId: z.number().int().positive("Notification ID must be a positive integer"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of notifications (viewAll)
  static notificationsResponseSchema = z.array(this.notificationSchema);
}

export default NotificationsSchemas;