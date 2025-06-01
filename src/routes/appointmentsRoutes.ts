import { FastifyTypedInstance } from "../types/fastify_types";
import AppointmentsController from "../controllers/AppointmentsController";
import AppointmentsSchemas from "../schemas/AppointmentsSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function appointmentsRoutes(app: FastifyTypedInstance) {
  const controller = new AppointmentsController();

  // Register a new appointment
  app.post(
    "/appointments/register",
    {
      schema: {
        description: "Register a new appointment",
        tags: ["Appointments"],
        body: AppointmentsSchemas.RegisterAppointment,
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.success_response,
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

  // Update an appointment
  app.put(
    "/appointments/update",
    {
      schema: {
        description: "Update an appointment",
        tags: ["Appointments"],
        body: AppointmentsSchemas.UpdateAppointment,
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.success_response,
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

  // Delete an appointment
  app.delete(
    "/appointments",
    {
      schema: {
        description: "Delete an appointment",
        tags: ["Appointments"],
        body: AppointmentsSchemas.DeleteAppointment,
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.success_response,
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

  // View all appointments
  app.get(
    "/appointments",
    {
      schema: {
        description: "View all appointments for a user",
        tags: ["Appointments"],
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.appointmentsResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request.headers));
    }
  );

  // View an appointment for an employee
  app.get(
    "/appointments/employee",
    {
      schema: {
        description: "View an appointment for an employee",
        tags: ["Appointments"],
        body: AppointmentsSchemas.ViewEmployeeAppointment,
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.appointmentSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewEmployee(request.body, request.headers));
    }
  );

  // Add an employee to an appointment
  app.post(
    "/appointments/add-employee",
    {
      schema: {
        description: "Add an employee to an appointment",
        tags: ["Appointments"],
        body: AppointmentsSchemas.AddEmployeeAppointment,
        headers: tokenSchema,
        response: {
          200: AppointmentsSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.addEmployee(request.body, request.headers));
    }
  );
}