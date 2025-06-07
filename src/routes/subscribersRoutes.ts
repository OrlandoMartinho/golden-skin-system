import { FastifyTypedInstance } from "../types/fastify_types";
import SubscribersController from "../controllers/SubscribersController";
import SubscribersSchemas from "../schemas/SubscribersSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function subscribersRoutes(app: FastifyTypedInstance) {
  const controller = new SubscribersController();

  // Register a new subscriber
  app.post(
    "/subscribers/register",
    {
      schema: {
        description: "Register a new subscriber",
        tags: ["Subscribers"],
        body: SubscribersSchemas.RegisterSubscriber,
        headers: SubscribersSchemas.tokenSchema,
        response: {
          200: SubscribersSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.registerSubscriber(request.body, request.headers));
    }
  );

  // Delete a subscriber
  app.delete(
    "/subscribers",
    {
      schema: {
        description: "Delete a subscriber",
        tags: ["Subscribers"],
        body: SubscribersSchemas.DeleteSubscriber,
        headers: SubscribersSchemas.tokenSchema,
        response: {
          200: SubscribersSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.deleteSubscriber(request.body, request.headers));
    }
  );

  // Update a subscriber
  app.put(
    "/subscribers",
    {
      schema: {
        description: "Update a subscriber",
        tags: ["Subscribers"],
        body: SubscribersSchemas.UpdateSubscriber,
        headers: SubscribersSchemas.tokenSchema,
        response: {
          200: SubscribersSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.updateSubscriber(request.body, request.headers));
    }
  );

  // View a single subscriber
  app.get(
    "/subscribers/view",
    {
      schema: {
        description: "View a single subscriber",
        tags: ["Subscribers"],
        params: SubscribersSchemas.ViewSubscriber,
        headers: SubscribersSchemas.tokenSchema,
        response: {
          200: SubscribersSchemas.subscriberSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewSubscriber(request.params, request.headers));
    }
  );

  // View all subscribers
  app.get(
    "/subscribers",
    {
      schema: {
        description: "View all subscribers",
        tags: ["Subscribers"],
        headers: SubscribersSchemas.tokenSchema,
        response: {
          200: SubscribersSchemas.subscribersResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAllSubscribers(request.params, request.headers));
    }
  );
}