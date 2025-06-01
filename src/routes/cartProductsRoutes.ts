import { FastifyTypedInstance } from "../types/fastify_types";
import CartProductsController from "../controllers/CartProductsController";
import CartProductsSchemas from "../schemas/CartProductsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function cartProductsRoutes(app: FastifyTypedInstance) {
  const controller = new CartProductsController();

  // Register a new cart product
  app.post(
    "/cart-products/register",
    {
      schema: {
        description: "Register a new product in a cart",
        tags: ["CartProducts"],
        body: CartProductsSchemas.RegisterCartProduct,
        headers: tokenSchema,
        response: {
          200: CartProductsSchemas.success_response,
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

  // Delete a cart product
  app.delete(
    "/cart-products",
    {
      schema: {
        description: "Delete a product from a cart",
        tags: ["CartProducts"],
        body: CartProductsSchemas.DeleteCartProduct,
        headers: tokenSchema,
        response: {
          200: CartProductsSchemas.success_response,
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

  // Update a cart product's status (response)
  app.put(
    "/cart-products/response",
    {
      schema: {
        description: "Update the status of a product in a cart",
        tags: ["CartProducts"],
        params: CartProductsSchemas.ResponseCartProduct,
        headers: tokenSchema,
        response: {
          200: CartProductsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.response(request.params, request.headers));
    }
  );

  // View a single cart product
  app.get(
    "/cart-products/view-a",
    {
      schema: {
        description: "View a single product in a cart",
        tags: ["CartProducts"],
        body: CartProductsSchemas.ViewCartProduct,
        headers: tokenSchema,
        response: {
          200: CartProductsSchemas.cartProductSchema,
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

  // View all cart products in a cart
  app.get(
    "/cart-products",
    {
      schema: {
        description: "View all products in a cart",
        tags: ["CartProducts"],
        body: CartProductsSchemas.ViewCartProducts,
        headers: tokenSchema,
        response: {
          200: CartProductsSchemas.cartProductsResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request.body, request.headers));
    }
  );
}