import { FastifyTypedInstance } from "../types/fastify_types";
import ProductsController from "../controllers/ProductsController";
import ProductsSchemas from "../schemas/ProductsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function productsRoutes(app: FastifyTypedInstance) {
  const controller = new ProductsController();

  // Register a new product
  app.post(
    "/products/register",
    {
      schema: {
        description: "Register a new product",
        tags: ["Products"],
        body: ProductsSchemas.RegisterProduct,
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.success_response,
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

  // Update a product
  app.put(
    "/products/update",
    {
      schema: {
        description: "Update a product",
        tags: ["Products"],
        body: ProductsSchemas.UpdateProduct,
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.success_response,
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

  // Delete a product
  app.delete(
    "/products",
    {
      schema: {
        description: "Delete a product",
        tags: ["Products"],
        body: ProductsSchemas.DeleteProduct,
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.success_response,
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

  // View a single product
  app.get(
    "/products/view-a",
    {
      schema: {
        description: "View a single product",
        tags: ["Products"],
        body: ProductsSchemas.ViewProduct,
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.productSchema,
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

  // View all products
  app.get(
    "/products",
    {
      schema: {
        description: "View all products",
        tags: ["Products"],
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.productsResponseSchema,
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

  // Upload a product photo
  app.post(
    "/products/upload-photo",
    {
      schema: {
        description: "Upload a photo for a product",
        tags: ["Products"],
        body: ProductsSchemas.UploadPhotoProduct,
        headers: tokenSchema,
        response: {
          200: ProductsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.uploadPhoto(request.body, request.headers));
    }
  );
}