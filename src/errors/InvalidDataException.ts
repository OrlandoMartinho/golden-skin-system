// src/exceptions/InvalidDataException.ts

export default class InvalidDataException extends Error {
  public statusCode: number;

  constructor(message: string = "Invalid data sent in the request") {
    super(message);
    this.name = "InvalidDataException";
    this.statusCode = 400; // Código HTTP para "Bad Request"
    Object.setPrototypeOf(this, InvalidDataException.prototype);
    Error.captureStackTrace(this, InvalidDataException);
  }
}
