import { z } from 'zod';

class CartsSchemas {
  // Schema for a single cart
  static cartSchema = z.object({
    idCart: z.number(),
    idUser: z.number(),
    status: z.number(),
  });

  // Schema for adding a cart
  static AddCart = z.object({
    idUser: z.number().int().positive("ID User must be a positive integer"),
    status: z.number().int().nonnegative("Status must be a non-negative integer"),
  });

  // Schema for deleting a cart
  static DeleteCart = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
  });

  // Schema for viewing a single cart (via params)
  static ViewCart = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of carts
  static cartsResponseSchema = z.array(this.cartSchema);
}

export default CartsSchemas;