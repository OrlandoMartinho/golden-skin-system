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

      const chat = await prisma.chats.findUnique({ where: { idChat:Number(idChat) },include: { Messages: true } });
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
      console.error('Error in viewA:', error);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
        console.log('Campo inválido:', err.path.join('.'));
        console.log('Mensagem:', err.message);
      })
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

        // Fetch chats with all messages
        const chats = await prisma.chats.findMany({
            where: {
                OR: [{ idUser: userId }, { idUser2: userId }],
            },
            include: {
                Messages: {
                    orderBy: {
                        createdIn: 'asc' // Or 'desc' depending on your needs
                    }
                }
            }
        });

        // Get all unique user IDs involved in chats
        const userIds = new Set<number>();
        chats.forEach(chat => {
            userIds.add(chat.idUser as number);
            userIds.add(chat.idUser2 as number);
        });

        // Fetch all users data in a single query
        const users = await prisma.users.findMany({
            where: {
                idUser: { in: Array.from(userIds) }
            },
            select: {
                idUser: true,
                name: true,
                photo: true
            }
        });

        // Create a map for quick user lookup
        const usersMap = new Map<number, { name: string; photo: string }>();
        users.forEach(user => {
            usersMap.set(user.idUser, { name: user.name, photo: user.photo || '' });
        });

        // Process chats while keeping messages
        const processedChats = chats.map(chat => {
            const user1 = usersMap.get(chat.idUser as number);
            const user2 = usersMap.get(chat.idUser2 as number);
            const messages = chat.Messages.map(message => ({
                ...message,
                createdIn: message.createdIn  // Format dates if needed
            }));

            const lastMessage = chat.Messages.length > 0 
                ? chat.Messages[chat.Messages.length - 1] 
                : null;

            return {
                ...chat,
                userName1: user1?.name,
                userPhoto1: user1?.photo,
                user2Name: user2?.name,
                userPhoto2: user2?.photo,
                lastMessage: lastMessage?.description,
                lastMessageDate: lastMessage?.createdIn,
                createdIn:chat.createdIn ,
                Messages: messages 
            };
        });
        console.log(processedChats);
        return ChatsSchemas.chatsResponseSchema.parse(processedChats);
    } catch (error) {
        if (error instanceof AuthorizationException || error instanceof InvalidDataException) {
          console.error('Authorization or validation error in viewAll:', error);  
          throw error;

        }
        console.error('Error in viewAll:', error);
        throw new InternalServerErrorException('An error occurred when trying to retrieve chats');
    }
}
}

export default ChatsController;