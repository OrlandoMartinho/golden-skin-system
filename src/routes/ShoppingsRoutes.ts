import { FastifyTypedInstance } from "../types/fastify_types";
import ShoppingsController from "../controllers/ShoppingsController";
import ShoppingsSchemas from "../schemas/ShoppingsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function shoppingsRoutes(app: FastifyTypedInstance) {
  const controller = new ShoppingsController();

  // Register a new shopping
  app.post(
    "/shoppings/register",
    {
      schema: {
        description: "Register a new shopping for a user",
        tags: ["Shoppings"],
        body: ShoppingsSchemas.RegisterShopping,
        response: {
          200: ShoppingsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const { idUser } = request.body as any;
      return reply.status(200).send(await controller.register({ idUser }));
    }
  );

  // Update a shopping
  app.put(
    "/shoppings/update",
    {
      schema: {
        description: "Update shopping status",
        tags: ["Shoppings"],
        body: ShoppingsSchemas.UpdateShopping,
        headers: tokenSchema,
        response: {
          200: ShoppingsSchemas.success_response,
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

  // Delete a shopping
  app.delete(
    "/shoppings",
    {
      schema: {
        description: "Delete a shopping",
        tags: ["Shoppings"],
        body: ShoppingsSchemas.DeleteShopping,
        headers: tokenSchema,
        response: {
          200: ShoppingsSchemas.success_response,
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

  // View a single shopping
  app.get(
    "/shoppings/view-a",
    {
      schema: {
        description: "View a single shopping",
        tags: ["Shoppings"],
        params: ShoppingsSchemas.ViewShopping,
        headers: tokenSchema,
        response: {
          200: ShoppingsSchemas.shoppingSchema,
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

  // View all shoppings for a user
  app.get(
    "/shoppings",
    {
      schema: {
        description: "View all shoppings for a user",
        tags: ["Shoppings"],
        headers: tokenSchema,
        response: {
          200: ShoppingsSchemas.shoppingsResponseSchema,
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