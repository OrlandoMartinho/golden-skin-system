// src/exceptions/ItemNotFoundException.ts

export default class ItemNotFoundException extends Error {
  public statusCode: number;

  constructor(message: string = "Item not found") {
    super(message);
    this.name = "ItemNotFoundException";
    this.statusCode = 404; // Código HTTP para "Not Found"
    Object.setPrototypeOf(this, ItemNotFoundException.prototype);
    Error.captureStackTrace(this, ItemNotFoundException);
  }
}
