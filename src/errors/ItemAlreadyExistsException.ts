// src/exceptions/ItemAlreadyExistsException.ts

export default class ItemAlreadyExistsException extends Error {
  public statusCode: number;

  constructor(message: string = "Item already exists") {
    super(message);
    this.name = "ItemAlreadyExistsException";
    this.statusCode = 409; // Código HTTP 409 Conflict
    Object.setPrototypeOf(this, ItemAlreadyExistsException.prototype);
    Error.captureStackTrace(this, ItemAlreadyExistsException);
  }
}
