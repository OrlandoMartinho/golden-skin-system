import { z } from 'zod';

class MessagesSchemas {
  // Schema for a single message
  static messageSchema = z.object({
    idMessage: z.number().optional(),
    idUser: z.number(),
    idChat: z.number(),
    username: z.string(),
    createdIn: z.string(),
    updatedIn: z.string(),
  });

  // Schema for registering a message
  static RegisterMessage = z.object({
    idChat: z.number().int().positive("ID Chat must be a positive integer"),
    username: z.string().min(1, "Username is required"),
  });

  // Schema for deleting a message
  static DeleteMessage = z.object({
    idMessage: z.number().int().positive("ID Message must be a positive integer"),
  });

  // Schema for updating a message
  static UpdateMessage = z.object({
    idMessage: z.number().int().positive("ID Message must be a positive integer"),
    username: z.string().min(1, "Username is required"),
  });

  // Schema for viewing all messages in a chat
  static ViewMessages = z.object({
    idChat: z.number().int().positive("ID Chat must be a positive integer"),
  });

  // Schema for viewing a single message
  static ViewMessage = z.object({
    idMessage: z.number().int().positive("ID Message must be a positive integer"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of messages
  static messagesResponseSchema = z.array(this.messageSchema);
}

export default MessagesSchemas;