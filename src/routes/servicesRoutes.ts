import { FastifyTypedInstance } from "../types/fastify_types";
import ServicesController from "../controllers/ServicesController";
import ServicesSchemas from "../schemas/ServicesSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";
import DataExtracMultipart from "../utils/fastify_multipart_data_extraction";

export async function servicesRoutes(app: FastifyTypedInstance) {
  const controller = new ServicesController();
  const extractData = new DataExtracMultipart();

  // Add a new service
  app.post(
    "/services/add",
    {
      schema: {
        description: "Add a new service",
        tags: ["Services"],
        consumes: ['multipart/form-data'],
        body: ServicesSchemas.AddService,
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      return reply.status(200).send(await controller.add(data, request.headers, file));
    }
  );

  // Edit a service
  app.put(
    "/services/edit",
    {
      schema: {
        description: "Edit a service",
        tags: ["Services"],
        consumes: ['multipart/form-data'],
        body: ServicesSchemas.EditService,
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      return reply.status(200).send(await controller.edit(data, request.headers, file));
    }
  );

  // Delete a service
  app.delete(
    "/services",
    {
      schema: {
        description: "Delete a service",
        tags: ["Services"],
        body: ServicesSchemas.DeleteService,
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.success_response,
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

  // View a single service
  app.get(
    "/services/:idService",
    {
      schema: {
        description: "View a single service",
        tags: ["Services"],
        params: ServicesSchemas.ViewService,
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.serviceSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewA(request.params, request.headers, request));
    }
  );

  // View all services
  app.get(
    "/services",
    {
      schema: {
        description: "View all services",
        tags: ["Services"],
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.servicesResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request.headers, request));
    }
  );

  // Upload a service photo
  app.patch(
    "/services/upload-photo",
    {
      schema: {
        description: "Upload a photo for a service",
        tags: ["Services"],
        consumes: ['multipart/form-data'],
        body: ServicesSchemas.UploadPhotoService,
        headers: tokenSchema,
        response: {
          200: ServicesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      return reply.status(200).send(await controller.uploadPhoto(file, data, request.headers));
    }
  );
}