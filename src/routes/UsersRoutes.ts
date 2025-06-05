import { FastifyTypedInstance } from "../types/fastify_types";
import UsersController from "../controllers/UsersController";
import UsersSchemas from "../schemas/UsersSchemas";
import tokenSchema from "../schemas/TokensServicesSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function userRoutes(app: FastifyTypedInstance) {
  const controller = new UsersController();


  

  // Register user
  app.post(
    "/users/register",
    {
      schema: {
        description: "Register a new user",
        tags: ["Users"],
        body: UsersSchemas.UserRegister,
        response: {
          200: UsersSchemas.AuthenticateResponse,
          400: ResponsesSchemas.error_400_response,
          409: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
     return reply.status(200).send(await controller.register(request.body));
    }
  );

   // Register Worker
   app.post(
    "/users/register-worker",
    {
      schema: {
        description: "Register a new worker",
        tags: ["Users"],
        body: UsersSchemas.UserWorker,
        headers:UsersSchemas.tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          409: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
     return reply.status(200).send(await controller.registerWorker(request.body,request.headers));
    }
  );



  // Authenticate user
  app.post(
    "/users/authenticate",
    {
      schema: {
        description: "Authenticate user",
        tags: ["Users"],
        body: UsersSchemas.Authenticate,
        response: {
         200: UsersSchemas.AuthenticateResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      console.log("Request body:", request.body);
      return reply.status(200).send(
        await controller.authenticate(request.body))
      
    }
  );

  // Receive authentication code
  app.post(
    "/users/receive-code",
    {
      schema: {
        description: "Receive authentication code",
        tags: ["Users"],
        body: UsersSchemas.ReceiveCode,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(
        await controller.receive_code(request.body)
      );
    }
  );

  // Recover password
  app.post(
    "/users/recover-password",
    {
      schema: {
        description: "Update password using code",
        tags: ["Users"],
        body: UsersSchemas.RecoverPassword,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(
        await controller.updatePasswordWithCode(request.body
        )    
      )
    }
  );

  // Change email
  app.patch(
    "/users/change-email",
    {
      schema: {
        description: "Change user email",
        tags: ["Users"],
        body: UsersSchemas.ChangeEmail,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          409: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.changeEmail(request.body, request.headers));

    }
  );

  // Edit password
  app.patch(
    "/users/password-edit",
    {
      schema: {
        description: "Edit user password",
        tags: ["Users"],
        body:  UsersSchemas.PasswordEdit,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.password_edit(request.body, request.headers));
    }
  );

  // Update user
  app.put(
    "/users/update",
    {
      schema: {
        description: "Update user information",
        tags: ["Users"],
        body: UsersSchemas.UsersUpdate,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
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


    // Update user
    app.put(
      "/users/update-worker",
      {
        schema: {
          description: "Update user information",
          tags: ["Users"],
          body: UsersSchemas.UsersWorkerUpdate,
          headers: tokenSchema,
          response: {
            200: ResponsesSchemas.success_response,
            400: ResponsesSchemas.error_400_response,
            401: ResponsesSchemas.general_error_response,
            404: ResponsesSchemas.general_error_response,
            500: ResponsesSchemas.general_error_response,
          },
        },
      },
      async (request, reply) => {
       return reply.status(200).send(await controller.updateWorker(request.body, request.headers));
      }
    );

  // Delete user
  app.delete(
    "/users",
    {
      schema: {
        description: "Delete user account",
        tags: ["Users"],
        body: UsersSchemas.DeleteUser,
        headers: tokenSchema,
        response: {
          200: ResponsesSchemas.success_response,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          403: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.delete(request.body, request.headers));
    }
  );

  // View single user
  app.get(
    "/users/view-a",
    {
      schema: {
        description: "View user information",
        tags: ["Users"],
        headers: tokenSchema,
        response: {
          200: UsersSchemas.userSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
     return reply.status(200).send(await controller.viewA(request.headers,request));
    }
  );

  // View all users
  app.get(
    "/users",
    {
      schema: {
        description: "View all users",
        tags: ["Users"],
        headers: tokenSchema,
        response: {
          200: UsersSchemas.usersResponseSchema,
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

  // Upload user photo
  app.patch(
    "/users/upload-photo",
    {
      schema: {
        description: "Upload user photo",
        tags: ["Users"],
        headers: tokenSchema,
        consumes: ["multipart/form-data"],
        body: UsersSchemas.uploadFile,
        response: {
          200: UsersSchemas.uploadPhotoResponseSchema,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
    
      return reply.status(200).send(await controller.uploadPhoto(request.headers,request.file(), request)); 
 } );
}