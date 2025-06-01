import { FastifyTypedInstance } from "../types/fastify_types";
import MessagesController from "../controllers/MessagesController";
import MessagesSchemas from "../schemas/MessagesSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function messagesRoutes(app: FastifyTypedInstance) {
  const controller = new MessagesController();

  // Register a new message
  app.post(
    "/messages/register",
    {
      schema: {
        description: "Register a new message in a chat",
        tags: ["Messages"],
        body: MessagesSchemas.RegisterMessage,
        headers: tokenSchema,
        response: {
          200: MessagesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.register(request.body, request.headers));
    }
  );

  // Delete a message
  app.delete(
    "/messages",
    {
      schema: {
        description: "Delete a message",
        tags: ["Messages"],
        body: MessagesSchemas.DeleteMessage,
        headers: tokenSchema,
        response: {
          200: MessagesSchemas.success_response,
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

  // Update a message
  app.put(
    "/messages/update",
    {
      schema: {
        description: "Update a message's username",
        tags: ["Messages"],
        body: MessagesSchemas.UpdateMessage,
        headers: tokenSchema,
        response: {
          200: MessagesSchemas.success_response,
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

  // View all messages in a chat
  app.get(
    "/messages",
    {
      schema: {
        description: "View all messages in a chat",
        tags: ["Messages"],
        params: MessagesSchemas.ViewMessages,
        headers: tokenSchema,
        response: {
          200: MessagesSchemas.messagesResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request.params, request.headers));
    }
  );

  // View a single message
  app.get(
    "/messages/view-a",
    {
      schema: {
        description: "View a single message",
        tags: ["Messages"],
        body: MessagesSchemas.ViewMessage,
        headers: tokenSchema,
        response: {
          200: MessagesSchemas.messageSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewA(request.body, request.headers));
    }
  );
}