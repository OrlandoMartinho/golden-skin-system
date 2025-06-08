import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import MessagesSchemas from '../schemas/MessagesSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class MessagesController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = MessagesSchemas.success_response;

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

  public async register(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(MessagesSchemas.RegisterMessage, data);
    const validatedKey = await this.zodError(MessagesSchemas.tokenSchema, key);
    const { idChat, description } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({ where: { idUser: userId } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const chat = await prisma.chats.findUnique({ where: { idChat } });
      if (!chat) {
        throw new ItemNotFoundException('Chat not found');
      }

      if (chat.idUser !== userId && chat.idUser2 !== userId) {
        throw new AuthorizationException('Not authorized to send messages in this chat');
      }

      await prisma.messages.create({
        data: {
          idUser: userId,
          idChat,
          username:user.name,
          description,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Message registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register message');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(MessagesSchemas.DeleteMessage, data);
    const validatedKey = await this.zodError(MessagesSchemas.tokenSchema, key);
    const { idMessage } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const message = await prisma.messages.findUnique({ where: { idMessage } });
      if (!message) {
        throw new ItemNotFoundException('Message not found');
      }

      const chat = await prisma.chats.findUnique({ where: { idChat: message.idChat as number} });
      if (!chat) {
        throw new ItemNotFoundException('Chat not found');
      }

      if (chat.idUser !== userId && chat.idUser2 !== userId) {
        throw new AuthorizationException('Not authorized to delete messages in this chat');
      }

      await prisma.messages.delete({ where: { idMessage } });

      return { message: 'Message deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete message');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(MessagesSchemas.UpdateMessage, data);
    const validatedKey = await this.zodError(MessagesSchemas.tokenSchema, key);
    const { idMessage, description } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({where:{idUser:userId}})


      if(!user){
        throw new ItemNotFoundException("User not found")
      }

      const message = await prisma.messages.findUnique({ where: { idMessage } });
      if (!message) {
        throw new ItemNotFoundException('Message not found');
      }

      const chat = await prisma.chats.findUnique({ where: { idChat: message.idChat as number } });
      if (!chat) {
        throw new ItemNotFoundException('Chat not found');
      }

      if (chat.idUser !== userId && chat.idUser2 !== userId) {
        throw new AuthorizationException('Not authorized to update messages in this chat');
      }

      if (message.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this message');
      }

      await prisma.messages.update({
        where: { idMessage },
        data: { username:user.name, updatedIn: new Date().toISOString(),description },
      });

      return { message: 'Message updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update message');
    }
  }

  public async viewAll(data: any, key: any): Promise<z.infer<typeof MessagesSchemas.messagesResponseSchema>> {
    const validatedData = await this.zodError(MessagesSchemas.ViewMessages, data);
    const validatedKey = await this.zodError(MessagesSchemas.tokenSchema, key);
    const { idChat } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const chat = await prisma.chats.findUnique({ where: { idChat } });
      if (!chat) {
        throw new ItemNotFoundException('Chat not found');
      }

      if (chat.idUser !== userId && chat.idUser2 !== userId) {
        throw new AuthorizationException('Not authorized to view messages in this chat');
      }

      const messages = await prisma.messages.findMany({ where: { idChat } });

      return MessagesSchemas.messagesResponseSchema.parse(messages);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve messages');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof MessagesSchemas.messageSchema>> {
    const validatedData = await this.zodError(MessagesSchemas.ViewMessage, data);
    const validatedKey = await this.zodError(MessagesSchemas.tokenSchema, key);
    const { idMessage } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const message = await prisma.messages.findUnique({ where: { idMessage } });
      if (!message) {
        throw new ItemNotFoundException('Message not found');
      }

      const chat = await prisma.chats.findUnique({ where: { idChat: message.idChat as number } });
      if (!chat) {
        throw new ItemNotFoundException('Chat not found');
      }

      if (chat.idUser !== userId && chat.idUser2 !== userId) {
        throw new AuthorizationException('Not authorized to view this message');
      }

      return MessagesSchemas.messageSchema.parse(message);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve message');
    }
  }
}

export default MessagesController;