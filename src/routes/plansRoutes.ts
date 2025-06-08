import { FastifyTypedInstance } from "../types/fastify_types";
import PlansController from "../controllers/PlansController";
import PlansSchemas from "../schemas/PlansSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function plansRoutes(app: FastifyTypedInstance) {
  const controller = new PlansController();

  // Register a new plan
  app.post(
    "/plans/register",
    {
      schema: {
        description: "Register a new plan",
        tags: ["Plans"],
        body: PlansSchemas.RegisterPlan,
        headers: PlansSchemas.tokenSchema,
        response: {
          200: PlansSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.registerPlan(request.body, request.headers));
    }
  );

  // Delete a plan
  app.delete(
    "/plans",
    {
      schema: {
        description: "Delete a plan",
        tags: ["Plans"],
        body: PlansSchemas.DeletePlan,
        headers: PlansSchemas.tokenSchema,
        response: {
          200: PlansSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.deletePlan(request.body, request.headers));
    }
  );

  // Update a plan
  app.put(
    "/plans",
    {
      schema: {
        description: "Update a plan",
        tags: ["Plans"],
        body: PlansSchemas.UpdatePlan,
        headers: PlansSchemas.tokenSchema,
        response: {
          200: PlansSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.updatePlan(request.body, request.headers));
    }
  );

  // View a single plan
  app.get(
    "/plans/view/:idPlan",
    {
      schema: {
        description: "View a single plan",
        tags: ["Plans"],
        params: PlansSchemas.ViewPlan,
        headers: PlansSchemas.tokenSchema,
        response: {
          200: PlansSchemas.planSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewPlan(request.params, request.headers));
    }
  );

  // View all plans
  app.get(
    "/plans",
    {
      schema: {
        description: "View all plans",
        tags: ["Plans"],
        headers: PlansSchemas.tokenSchema,
        response: {
          200: PlansSchemas.plansResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAllPlans(request.params, request.headers));
    }
  );
}