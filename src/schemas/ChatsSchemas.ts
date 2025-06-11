import { z } from 'zod';

class ChatsSchemas {
  // Schema for a single chat
  static chatSchema = z.object({
    idChat: z.number(),
    idUser: z.number(),
    idUser2: z.number(),
    user2Name: z.string(),
    userName1 :z.string(),
    userName2: z.string(),
    userPhoto2: z.string(),
    userPhoto1: z.string(),
    lastMessageDate: z.string().optional(),
    lastMessage: z.string().optional(),
    createdIn: z.string(),
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
    idChat: z.number().int().positive("ID Chat must be a positive integer"),
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