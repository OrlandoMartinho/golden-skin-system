import { FastifyTypedInstance } from "../types/fastify_types";
import CartsController from "../controllers/CartsController";
import CartsSchemas from "../schemas/CartsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function cartsRoutes(app: FastifyTypedInstance) {
  const controller = new CartsController();

  // Add a new cart
  app.post(
    "/carts/add",
    {
      schema: {
        description: "Add a new cart for a user",
        tags: ["Carts"],
        body: CartsSchemas.AddCart,
        headers: tokenSchema,
        response: {
          200: CartsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.add(request.body, request.headers));
    }
  );

  // Delete a cart
  app.delete(
    "/carts",
    {
      schema: {
        description: "Delete a cart",
        tags: ["Carts"],
        body: CartsSchemas.DeleteCart,
        headers: tokenSchema,
        response: {
          200: CartsSchemas.success_response,
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

  // View a single cart
  app.get(
    "/carts/:idCart",
    {
      schema: {
        description: "View a single cart",
        tags: ["Carts"],
        params: CartsSchemas.ViewCart,
        headers: tokenSchema,
        response: {
          200: CartsSchemas.cartSchema,
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

  // View all carts for a user
  app.get(
    "/carts",
    {
      schema: {
        description: "View all carts for a user",
        tags: ["Carts"],
        headers: tokenSchema,
        response: {
          200: CartsSchemas.cartsResponseSchema,
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