// src/exceptions/AuthorizationException.ts

export default class AuthorizationException extends Error {
  public statusCode: number;

  constructor(message: string = "Unauthorized - invalid or missing token") {
    super(message);
    this.name = "AuthorizationException";
    this.statusCode = 401; // Código HTTP para "Unauthorized"
    Object.setPrototypeOf(this, AuthorizationException.prototype);
    Error.captureStackTrace(this, AuthorizationException);
  }
}
