import { FastifyTypedInstance } from "../types/fastify_types";
import NotificationsController from "../controllers/NotificationsController";
import NotificationsSchemas from "../schemas/NotificationsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function notificationsRoutes(app: FastifyTypedInstance) {
  const controller = new NotificationsController();


  // Mark a notification as read
  app.patch(
    "/notifications/read",
    {
      schema: {
        description: "Mark a notification as read",
        tags: ["Notifications"],
        body: NotificationsSchemas.ReadNotification,
        headers: tokenSchema,
        response: {
          200: NotificationsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.read(request.body, request.headers));
    }
  );

  // Delete a notification
  app.delete(
    "/notifications",
    {
      schema: {
        description: "Delete a notification",
        tags: ["Notifications"],
        body: NotificationsSchemas.DeleteNotification,
        headers: tokenSchema,
        response: {
          200: NotificationsSchemas.success_response,
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

  // View a single notification
  app.get(
    "/notifications/view-a",
    {
      schema: {
        description: "View a single notification",
        tags: ["Notifications"],
        params: NotificationsSchemas.ViewNotification,
        headers: tokenSchema,
        response: {
          200: NotificationsSchemas.notificationSchema,
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

  // View all notifications for a user
  app.get(
    "/notifications",
    {
      schema: {
        description: "View all notifications for a user",
        tags: ["Notifications"],
        headers: tokenSchema,
        response: {
          200: NotificationsSchemas.notificationsResponseSchema,
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