import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ChatsSchemas from '../schemas/ChatsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class ChatsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = ChatsSchemas.success_response;

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

  public async add(data: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ChatsSchemas.AddChat, data);
    const { idUser, idUser2 } = validatedData;

    try {
      const user1 = await prisma.users.findUnique({ where: { idUser } });
      const user2 = await prisma.users.findUnique({ where: { idUser: idUser2 } });
      if (!user1 || !user2) {
        throw new ItemNotFoundException('One or both users not found');
      }

      await prisma.chats.create({
        data: {
          idUser,
          idUser2,
          createdIn: new Date().toISOString(),
        },
      });

      return { message: 'Chat added successfully' };
    } catch (error) {
      if (error instanceof ItemNotFoundException || error instanceof InvalidDataException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to add chat');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ChatsSchemas.UpdateChat, data);
    const validatedKey = await this.zodError(ChatsSchemas.tokenSchema, key);
    const { idChat, idUser2 } = validatedData;
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
        throw new AuthorizationException('Not authorized to update this chat');
      }

      const user2 = await prisma.users.findUnique({ where: { idUser: idUser2 } });
      if (!user2) {
        throw new ItemNotFoundException('User2 not found');
      }

      await prisma.chats.update({
        where: { idChat },
        data: { idUser2 },
      });

      return { message: 'Chat updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update chat');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ChatsSchemas.DeleteChat, data);
    const validatedKey = await this.zodError(ChatsSchemas.tokenSchema, key);
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
        throw new AuthorizationException('Not authorized to delete this chat');
      }

      await prisma.chats.delete({ where: { idChat } });

      return { message: 'Chat deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete chat');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof ChatsSchemas.chatSchema>> {
    const validatedData = await this.zodError(ChatsSchemas.ViewChat, data);
    const validatedKey = await this.zodError(ChatsSchemas.tokenSchema, key);
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
        throw new AuthorizationException('Not authorized to view this chat');
      }

      return ChatsSchemas.chatSchema.parse(chat);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve chat');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof ChatsSchemas.chatsResponseSchema>> {
    const validatedKey = await this.zodError(ChatsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const chats = await prisma.chats.findMany({
        where: {
          OR: [{ idUser: userId }, { idUser2: userId }],
        },
      });

      return ChatsSchemas.chatsResponseSchema.parse(chats);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve chats');
    }
  }
}

export default ChatsController;