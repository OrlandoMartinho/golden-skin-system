import { FastifyReply, FastifyRequest } from 'fastify';
import  AuthorizationException  from './AuthorizationException';
import  ForbiddenExceptionError  from './ForbiddenExceptionError';
import InternalServerErrorException  from './InternalServerErrorException';
import  InvalidDataException  from './InvalidDataException';
import  ItemAlreadyExistsException from './ItemAlreadyExistsException';
import  ItemNotFoundException  from './ItemNotFoundException';
import  FileErrorException  from './FileErrorException';


interface GeneralResponse {
  message: string;
}

export function generalExceptionHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  let statusCode = 500;
  let response: GeneralResponse = { message: 'Unexpected error occurred' };

  if (error instanceof ItemAlreadyExistsException) {
    statusCode = 409;
    response.message = error.message;
  } else if (error instanceof InvalidDataException) {
    statusCode = 400;
    response.message = error.message;
  } else if (error instanceof ItemNotFoundException) {
    statusCode = 404;
    response.message = error.message;
  } else if (error instanceof InternalServerErrorException) {
    statusCode = 500;
    response.message = error.message;
  } else if (error instanceof AuthorizationException) {
    statusCode = 401;
    response.message = error.message;
  } else if (error instanceof ForbiddenExceptionError) {
    statusCode = 403;
    response.message = error.message;
  } else if (error instanceof FileErrorException) {
    statusCode = 415;
    response.message = error.message;
  } else if (
    error.name === 'SyntaxError' && 
    /JSON/i.test(error.message)
  ) {
    // JSON malformado, equivalente a HttpMessageNotReadableException
    statusCode = 400;
    response.message = "The request body is malformed or missing";
  }

  reply.status(statusCode).send(response);
}
