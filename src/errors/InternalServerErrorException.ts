// src/exceptions/InternalServerErrorException.ts

export default class InternalServerErrorException extends Error {
  public statusCode: number;

  constructor(message: string = "A server error has occurred, please contact technical support") {
    super(message);
    this.name = "InternalServerErrorException";
    this.statusCode = 500; // Código HTTP para "Internal Server Error"
    Object.setPrototypeOf(this, InternalServerErrorException.prototype);
    Error.captureStackTrace(this, InternalServerErrorException);
  }
}
