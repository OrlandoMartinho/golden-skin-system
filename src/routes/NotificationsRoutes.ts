import { FastifyTypedInstance } from "../types/fastify_types";
import NotificationsController from "../controllers/NotificationsControllers";
import NotificationSchemas from "../schemas/NotificationsSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import { FastifyReply, FastifyRequest } from 'fastify';
import tokenSchema from "../schemas/TokensServicesSchemas";

export async function notificationRoutes(app: FastifyTypedInstance) {
  const controller = new NotificationsController();

  // Função auxiliar para tratamento de resposta
  function handleResponse(reply: FastifyReply, result: any) {
    if (result.code === 401) return reply.status(401).send({ message: "Unauthorized token", error: result.message });
    if (result.code === 404) return reply.status(404).send({ message: "Item not found", error: result.message });
    if (result.code === 500) return reply.status(500).send({ message: "Internal server error", error: result.message });

    return reply.status(200).send(result);
  }
  
  
  // // Hook: Validação do corpo da requisição
  // app.addHook('preHandler', async (request, reply) => {
  //   const bodyValidation = NotificationSchemas.readNotificationsSchema.safeParse(request.body);
  //   const tokenValidation = NotificationSchemas.tokenSchema.safeParse(request.headers);
    
  //   // Log para exibir as validações
  //   console.log("Validando corpo e token...");
  //   console.log("Corpo da requisição:", request.body);
  //   console.log("Cabeçalhos da requisição:", request.headers);

  //   if (!bodyValidation.success || !tokenValidation.success) {
  //     const bodyErrors = bodyValidation.error?.errors.map((err) => err.message) || [];
  //     const tokenErrors = tokenValidation.error?.errors.map((err) => err.message) || [];
      
  //     console.log("Erros de validação encontrados:", { bodyErrors, tokenErrors });

  //     return reply.status(400).send({
  //       message: "Error in received data",
  //       bodyErrors,
  //       tokenErrors,
  //     });
  //   }

  //   console.log("Corpo e token validados no preHandler:", bodyValidation.data, tokenValidation.data);
  // });


  // Read all notifications
  app.put(
    "/notifications",
    {
      schema: {
        description: "Read notifications",
        tags: ["Notifications"],
        body: NotificationSchemas.readBodyNotificationsSchema,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        }
      },
    },
    async (request, reply) => {
      try {
        const bodyValidation = NotificationSchemas.deleteNotificationSchema.safeParse(request.body);
        const tokenValidation = NotificationSchemas.tokenSchema.safeParse(request.headers);

        if (!bodyValidation.success || !tokenValidation.success) {
          return reply.status(400).send({
            message: "Error in received data",
            errors: [
              ...(!bodyValidation.success ? bodyValidation.error.errors.map((err) => err.message) : []),
              ...(!tokenValidation.success ? tokenValidation.error.errors.map((err) => err.message) : []),
            ],
          });
        }
        const result = await controller.read({ ...bodyValidation.data, token: tokenValidation.data.token });
        return handleResponse(reply, result);
      } catch (error) {
        return reply.status(500).send({ message: "Internal server error", error: error instanceof Error ? error.message : "Error reading notifications" });
      }
    }
  );

  // Delete a notification
  app.delete(
    "/notifications",
    {
      schema: {
        description: "Delete a notification",
        tags: ["Notifications"],
        body: NotificationSchemas.deleteNotificationSchema,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          400: ResponsesSchemas.error_400_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      try {
        const bodyValidation = NotificationSchemas.deleteNotificationSchema.safeParse(request.body);
        const tokenValidation = NotificationSchemas.tokenSchema.safeParse(request.headers);

        if (!bodyValidation.success || !tokenValidation.success) {
          return reply.status(400).send({
            message: "Error in received data",
            errors: [
              ...(!bodyValidation.success ? bodyValidation.error.errors.map((err) => err.message) : []),
              ...(!tokenValidation.success ? tokenValidation.error.errors.map((err) => err.message) : []),
            ],
          });
        }

        const result = await controller.delete({ ...bodyValidation.data, token: tokenValidation.data.token });
        return handleResponse(reply, result);
      } catch (error) {
        return reply.status(500).send({ message: "Internal server error", error: error instanceof Error ? error.message : "Error deleting notification" });
      }
    }
  );

  // View notifications by user
  app.get(
    "/notifications",
    {
      schema: {
        description: "View notifications by user",
        tags: ["Notifications"],
        headers: tokenSchema,
        response: {
          200: NotificationSchemas.viewResponseSchema,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          400: ResponsesSchemas.error_400_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      try {
        const tokenValidation = NotificationSchemas.tokenSchema.safeParse(request.headers);
        if (!tokenValidation.success) {
          return reply.status(401).send({
            message: "Unauthorized token",
            errors: tokenValidation.error.errors.map((err) => err.message),
          });
        }

        const result = await controller.viewByUser(tokenValidation.data);
        return handleResponse(reply, result);
      } catch (error) {
        return reply.status(500).send({ 
          message: "Internal server error", 
          error: error instanceof Error ? error.message : "Erro ao buscar notificações" 
        });
      }
    }
  );
}
