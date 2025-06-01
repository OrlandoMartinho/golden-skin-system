

export default class ForbiddenExceptionError extends Error {
  public statusCode: number;

  constructor(message: string = "Forbidden - invalid or missing token") {
    super(message);
    this.name = "ForbiddenExceptionError";
    this.statusCode = 403; // Código HTTP para "Forbidden"
    Object.setPrototypeOf(this, ForbiddenExceptionError.prototype);
    Error.captureStackTrace(this, ForbiddenExceptionError);
  }
}
