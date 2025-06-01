import { z } from "zod";

class NotificationSchemas {
  // Schema para adicionar uma notificação
  static addNotificationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    idUser: z.number().int().min(1, "User ID must be a positive integer"),
  });

    // Schema para leitura de notificações
    static operateNotification = z.object({
      idNotification: z.number(),
      token :z.string()
    });



  static readBodyNotificationsSchema = z.object({
    idNotification: z.number({ required_error: "idNotification is required" })
  })

  static readNotificationsSchema = z.object({
    idNotification: z.number({ required_error: "idNotification is required" })
  });
  // Schema para operar uma notificação
  static operateNotificationSchema = z.object({
    idNotification: z.number({ required_error: "idNotification is required" }).int().positive({ message: "Id must be a positive integer" }),
    token: z.string({ required_error: "token is required" }).min(1, { message: "Token is required" }),
  });

  // Schema para deletar uma notificação
  static deleteNotificationSchema = z.object({
    idNotification: z.number({ required_error: "idNotification is required" })
      .int()
      .positive({ message: "Id must be a positive integer" }),
  });

  static tokenSchema = z.object({
    token :z.string({ required_error: "The token cannot be empty" }).min(6,"By default a token has more than 8 characters")
  })
 
  

  static viewResponseSchema = z.object({
    message: z.string(),
    code: z.number(),
    result:z.array(z.object({
      title: z.string(),
      description: z.string(),
      idUser: z.number(),
      idNotification: z.number(),
      created_in: z.date().nullable(),
      read: z.boolean(),
    })).optional()
  });

}

export default NotificationSchemas;
