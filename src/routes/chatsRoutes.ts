import { FastifyTypedInstance } from "../types/fastify_types";
import ChatsController from "../controllers/ChatsController";
import ChatsSchemas from "../schemas/ChatsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function chatsRoutes(app: FastifyTypedInstance) {
  const controller = new ChatsController();

  // Add a new chat
  app.post(
    "/chats/add",
    {
      schema: {
        description: "Add a new chat between two users",
        tags: ["Chats"],
        body: ChatsSchemas.AddChat,
        response: {
          200: ChatsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const { idUser, idUser2 } = request.body as any;
      return reply.status(200).send(await controller.add({ idUser, idUser2 }));
    }
  );

  // Update a chat
  app.put(
    "/chats/update",
    {
      schema: {
        description: "Update a chat's second user",
        tags: ["Chats"],
        body: ChatsSchemas.UpdateChat,
        headers: tokenSchema,
        response: {
          200: ChatsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.update(request.body, request.headers));
    }
  );

  // Delete a chat
  app.delete(
    "/chats",
    {
      schema: {
        description: "Delete a chat",
        tags: ["Chats"],
        body: ChatsSchemas.DeleteChat,
        headers: tokenSchema,
        response: {
          200: ChatsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.delete(request.body, request.headers));
    }
  );

  // View a single chat
  app.get(
    "/chats/view-a",
    {
      schema: {
        description: "View a single chat",
        tags: ["Chats"],
        params: ChatsSchemas.ViewChat,
        headers: tokenSchema,
        response: {
          200: ChatsSchemas.chatSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewA(request.params, request.headers));
    }
  );

  // View all chats for a user
  app.get(
    "/chats",
    {
      schema: {
        description: "View all chats for a user",
        tags: ["Chats"],
        headers: tokenSchema,
        response: {
          200: ChatsSchemas.chatsResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request.headers));
    }
  );
}