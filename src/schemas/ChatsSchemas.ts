import { z } from 'zod';
import MessagesSchemas from './MessagesSchemas';
class ChatsSchemas {
  // Schema for a single chat
  static chatSchema = z.object({
    idChat: z.number(),
    idUser: z.number(),
    idUser2: z.number(),
    userName1 :z.string().nullable(),
    userName2: z.string().nullable(),
    userPhoto2: z.string().nullable(),
    userPhoto1: z.string().nullable(),
    lastMessageDate: z.date().nullable(),
    lastMessage: z.string().nullable(),
    createdIn: z.date().nullable(),
    Messages: z.array(MessagesSchemas.messageSchema).optional(),
  });

  // Schema for adding a chat
  static AddChat = z.object({
    idUser: z.number().int().positive("ID User must be a positive integer"),
    idUser2: z.number().int().positive("ID User2 must be a positive integer"),
  });

  // Schema for updating a chat
  static UpdateChat = z.object({
    idChat: z.number().int().positive("ID Chat must be a positive integer"),
    idUser2: z.number().int().positive("ID User2 must be a positive integer"),
  });

  // Schema for deleting a chat
  static DeleteChat = z.object({
    idChat: z.number().int().positive("ID Chat must be a positive integer"),
  });

  // Schema for viewing a single chat
  static ViewChat = z.object({
    idChat: z.string().min(1, "ID Chat is required"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of chats
  static chatsResponseSchema = z.array(this.chatSchema);
}

export default ChatsSchemas;