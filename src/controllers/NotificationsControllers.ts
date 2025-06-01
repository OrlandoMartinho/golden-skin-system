import { z } from "zod";
import { prisma } from "../config/PrismaClient";
import TokenService from "../services/TokensServices";
import NotificationSchemas from "../schemas/NotificationsSchemas";
import  tokenSchema from "../schemas/TokensServicesSchemas";

class NotificationsController {
  private tokenService: TokenService = new TokenService();
 
  // Função auxiliar para verificar e obter o userId a partir do token
  private async verifyTokenAndGetUserId(token: string): Promise<number | null> {
    try {
      const userId = await this.tokenService.userId(token);
      return userId || null;
    } catch (error) {
      return null;
    }
  }

  // Adiciona uma nova notificação
  async add(title: string, description: string, idUser: number) {
    try {
      await prisma.notifications.create({
        data: {
          read: false,
  
          description,
          idUser,
        },
      });
      console.log("Notification added successfully");
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  }

  // Lê e marca a notificação como lida
  async read(data: any) {
    try {
      const { idNotification, token } = NotificationSchemas.operateNotification.parse(data);
      const userId = await this.verifyTokenAndGetUserId(token);

      if (!userId) {
        return { message: "Invalid access token", code: 401 };
      }

      const notification = await prisma.notifications.findUnique({
        where: { idNotification, idUser: userId },
      });

      if (!notification) {
        return { message: "Notification not found", code: 404 };
      }

      await prisma.notifications.update({
        where: { idNotification },
        data: { read: true },
      });

      return {
        message: "Notification marked as read successfully",
        code: 200,
      };
    } catch (error) {
      console.error("Error reading notifications:", error);
      return {
        message: error instanceof Error ? error.message : String(error),
        code: 500,
      };
    }
  }

  // Deleta uma notificação por ID
  async delete(data: any) {
    try {
      const validatedData = NotificationSchemas.operateNotification.parse(data);
      let userId = await this.verifyTokenAndGetUserId(validatedData.token);
      const role = await this.tokenService.userRole(validatedData.token as string)
      if (!userId) {
        return { message: "Invalid access token", code: 401 };
      }
      if(role === 0){
        userId = 1
      }
      const notification = await prisma.notifications.findUnique({
        where: { idNotification: validatedData.idNotification, idUser: userId },
      });

      if (!notification) {
        return { message: "Notification not found", code: 404 };
      }

      await prisma.notifications.delete({
        where: { idNotification: validatedData.idNotification },
      });

      return {
        message: "Notification deleted successfully",
        code: 200,
      };
    } catch (error) {
      console.error("Error deleting notification:", error);
      return {
        message: error instanceof Error ? error.message : String(error),
        code: 500,
      };
    }
  }

  // Visualiza notificações de um usuário específico
async viewByUser(data: any) {
  try {
    console.log("Dados recebidos para validação:", data);

    const validatedData = tokenSchema.parse(data);
    console.log("Token validado:", validatedData);

    const userId = await this.verifyTokenAndGetUserId(validatedData.token as string);
    console.log("ID do usuário obtido:", userId);

    if (!userId) {
      console.warn("Token inválido. Nenhum usuário encontrado.");
      return { message: "Invalid access token", code: 401 };
    }
    const role =await  this.tokenService.userRole(validatedData.token as string);
    
    console.log("Buscando notificações do usuário no banco...");
    if(role === 0){
      const userNotifications = await prisma.notifications.findMany({
        where: { idUser: 1 },
      });
  
      console.log("Notificações encontradas:", userNotifications);
      return {
        message: "User notifications retrieved successfully",
        code: 200,
        result: userNotifications,
      };
    }
    const userNotifications = await prisma.notifications.findMany({
      where: { idUser: userId },
    });

    

    console.log("Notificações encontradas:", userNotifications);

    return {
      message: "User notifications retrieved successfully",
      code: 200,
      result: userNotifications,
    };
  } catch (error) {
    console.error("Erro ao recuperar notificações do usuário:", error);
    return {
      message: error instanceof Error ? error.message : String(error),
      error: 500,
    };
  }
}

}

export default NotificationsController;