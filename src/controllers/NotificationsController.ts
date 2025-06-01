import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import NotificationsSchemas from '../schemas/NotificationsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class NotificationsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = NotificationsSchemas.success_response;

  // Função para formatar o tempo decorrido
  private formatTimeAgo(notificationTime: string): string {
    const now = new Date();
    const notificationDate = new Date(notificationTime);
    const seconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `há ${interval} ano${interval === 1 ? '' : 's'}`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `há ${interval} mês${interval === 1 ? '' : 'es'}`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `há ${interval} dia${interval === 1 ? '' : 's'}`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `há ${interval}h`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `há ${interval} min`;
    }
    
    return 'agora mesmo';
  }

  // Zod error handler
  private async zodError(schema: z.ZodSchema, data: any): Promise<any> {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidDataException(error.errors.map(e => e.message).join(', '));
      }
      throw error;
    }
  }

  // Add a new notification
  public async add(icon: string, description: string, idUser: number) {
    const data = { icon, description, idUser };
    const validatedData = await this.zodError(NotificationsSchemas.AddNotification, data);

    try {
      const user = await prisma.users.findUnique({ where: { idUser: validatedData.idUser } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      await prisma.notifications.create({
        data: {
          icon: validatedData.icon,
          description: validatedData.description,
          notificationTime: new Date().toISOString(),
          read: false,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
          idUser: validatedData.idUser,
        },
      });

      console.log(`Notification added for user ID ${validatedData.idUser}`);
    } catch (error) {
     console.error('Error adding notification:', error);
    }
  }

  // Mark a notification as read
  public async read(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(NotificationsSchemas.ReadNotification, data);
    const validatedKey = await this.zodError(NotificationsSchemas.tokenSchema, key);
    const { notificationId } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const notification = await prisma.notifications.findUnique({
        where: { idNotification: notificationId },
      });

      if (!notification) {
        throw new ItemNotFoundException('Notification not found');
      }

      if (notification.idUser !== userId) {
        throw new AuthorizationException('Not authorized to read this notification');
      }

      if (notification.read) {
        throw new InvalidDataException('Notification already marked as read');
      }

      await prisma.notifications.update({
        where: { idNotification: notificationId },
        data: { read: true, updatedIn: new Date().toISOString() },
      });

      return { message: 'Notification marked as read successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to mark notification as read');
    }
  }

  // Delete a notification
  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(NotificationsSchemas.DeleteNotification, data);
    const validatedKey = await this.zodError(NotificationsSchemas.tokenSchema, key);
    const { notificationId } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const notification = await prisma.notifications.findUnique({
        where: { idNotification: notificationId },
      });

      if (!notification) {
        throw new ItemNotFoundException('Notification not found');
      }

      if (notification.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this notification');
      }

      await prisma.notifications.delete({
        where: { idNotification: notificationId },
      });

      return { message: 'Notification deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete notification');
    }
  }

  // View a single notification
  public async viewA(data: any, key: any): Promise<z.infer<typeof NotificationsSchemas.notificationSchema>> {
    const validatedData = await this.zodError(NotificationsSchemas.ViewNotification, data);
    const validatedKey = await this.zodError(NotificationsSchemas.tokenSchema, key);
    const { notificationId } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const notification = await prisma.notifications.findUnique({
        where: { idNotification: notificationId },
      });

      if (!notification) {
        throw new ItemNotFoundException('Notification not found');
      }

      if (notification.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this notification');
      }

      // Adiciona o tempo formatado à notificação
      const notificationWithTimeAgo = {
        ...notification,
        timeAgo: this.formatTimeAgo(notification.notificationTime as string)
      };

      return NotificationsSchemas.notificationSchema.parse(notificationWithTimeAgo);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve notification');
    }
  }

  // View all notifications for a user
  public async viewAll(key: any): Promise<z.infer<typeof NotificationsSchemas.notificationsResponseSchema>> {
    const validatedKey = await this.zodError(NotificationsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const notifications = await prisma.notifications.findMany({
        where: { idUser: userId },
        orderBy: {
          notificationTime: 'desc',
        },
      });

      // Adiciona o tempo formatado a cada notificação
      const notificationsWithTimeAgo = notifications.map(notification => ({
        ...notification,
        timeAgo: this.formatTimeAgo(notification.notificationTime as string)
      }));

      return NotificationsSchemas.notificationsResponseSchema.parse(notificationsWithTimeAgo);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve notifications');
    }
  }
}

export default NotificationsController;