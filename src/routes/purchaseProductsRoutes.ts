import { FastifyTypedInstance } from "../types/fastify_types";
import PurchaseProductsController from "../controllers/PurchaseProductsController";
import PurchaseProductsSchemas from "../schemas/PurchaseProductsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function purchaseProductsRoutes(app: FastifyTypedInstance) {
  const controller = new PurchaseProductsController();

  // Register a new purchase product
  app.post(
    "/purchase-products/register",
    {
      schema: {
        description: "Register a new product in a purchase",
        tags: ["PurchaseProducts"],
        body: PurchaseProductsSchemas.RegisterPurchaseProduct,
        headers: tokenSchema,
        response: {
          200: PurchaseProductsSchemas.success_response,
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

  // Update a purchase product
  app.put(
    "/purchase-products/update",
    {
      schema: {
        description: "Update a purchase product's details",
        tags: ["PurchaseProducts"],
        body: PurchaseProductsSchemas.UpdatePurchaseProduct,
        headers: tokenSchema,
        response: {
          200: PurchaseProductsSchemas.success_response,
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

  // Delete a purchase product
  app.delete(
    "/purchase-products",
    {
      schema: {
        description: "Delete a purchase product",
        tags: ["PurchaseProducts"],
        body: PurchaseProductsSchemas.DeletePurchaseProduct,
        headers: tokenSchema,
        response: {
          200: PurchaseProductsSchemas.success_response,
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

  // View a single purchase product
  app.get(
    "/purchase-products/view-a",
    {
      schema: {
        description: "View a single purchase product",
        tags: ["PurchaseProducts"],
        params: PurchaseProductsSchemas.ViewPurchaseProduct,
        headers: tokenSchema,
        response: {
          200: PurchaseProductsSchemas.purchaseProductSchema,
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

  // View all purchase products in a shopping
  app.get(
    "/purchase-products",
    {
      schema: {
        description: "View all purchase products in a shopping",
        tags: ["PurchaseProducts"],
        params: PurchaseProductsSchemas.ViewPurchaseProducts,
        headers: tokenSchema,
        response: {
          200: PurchaseProductsSchemas.purchaseProductsResponseSchema,
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
}