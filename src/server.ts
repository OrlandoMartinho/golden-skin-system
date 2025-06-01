import fastify, { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart'; 
import fastifyStatic from '@fastify/static';
import { routes } from './routes/routes';

import swaggerCSS from './utils/swagger_ui';
import path from 'path';
import dotenv from 'dotenv';
import database from './config/DataBase';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import FileService from './services/StorageServices';
import { generalExceptionHandler } from './errors/GeneralExceptionHandler';

dotenv.config();

const uploadsPath = path.join(__dirname, '../storage');

class Server {
  private readonly PORT: number;
  private readonly HOST: string;
  private readonly app: FastifyInstance;

  constructor() {
    this.PORT = Number(process.env.SERVER_PORT)  
    this.HOST = process.env.SERVER_HOST 
    this.app = fastify();
    this.configure();
    this.registerRoutes();
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await database.initialize();
  
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private configure() {
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);

    new FileService().createFolderSystem();

    this.app.register(fastifyMultipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit example
        files: 5 // Maximum number of files
      }
    });

    this.app.register(fastifyCors, { 
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });

    this.app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        status: 'error',
        message: `The route ${request.method}:${request.url} was not found.`,
        suggestion: 'Check if the URL and HTTP method are correct.'
      });
    });

    this.app.setErrorHandler((error, req, reply) => {
      generalExceptionHandler(error, req, reply);

      console.error('Error occurred:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: error.message,
          details: error.validation || []
        });
      }

      if (error.validation) {
        return reply.status(400).send({
          message: 'Validation error',
          details: error.validation
        });
      }

      if (error.code === 'FST_ERR_RESPONSE_SERIALIZATION') {
        return reply.status(500).send({
          statusCode: 500,
          error: "Internal Server Error",
          message: "Unexpected response format. Please check the response schema."
        });
      }

      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return reply.status(400).send({ 
          statusCode: 400,
          error: 'Bad Request',
          message: `Invalid JSON format: ${error.message}` 
        });
      }

      return reply.status(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        error: error.name || 'InternalServerError',
        message: error.message || 'Unexpected server error'
      });
    });

    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Linka API',
          version: '1.0.0',
          description: process.env.API_DESCRIPTION || 'API Documentation'
        },
        servers: [
          {
            url: `http://${this.HOST}:${this.PORT}`,
            description: 'Development server'
          }
        ]
      },
      transform: jsonSchemaTransform
    });

    this.app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      theme: {
        title: "Golden Skin API",
        css: [
          {
            filename: 'theme.css',
            content: swaggerCSS
          }
        ]
      },
     
    });
  }

  private registerRoutes() {
    this.app.register(fastifyStatic, {
      root: uploadsPath,
      prefix: '/uploads',
      decorateReply: false // Recommended for security
    });

    this.app.register(routes, { prefix: '/api' }); 
  }

  public async start() {
    try {
      await this.app.listen({ 
        port: this.PORT, 
        host: "0.0.0.0",
        listenTextResolver: (address) => {
          return `Server is running at ${address}`;
        }
      });
      console.log(`Server is running at http://${this.HOST}:${this.PORT}`);
      console.log(`Documentation available at http://${this.HOST}:${this.PORT}/docs`);
    } catch (err) {
      console.error('Error starting server:', err);
      process.exit(1);
    }
  }
}

const server = new Server();
server.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});