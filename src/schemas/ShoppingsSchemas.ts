import { z } from 'zod';
import PurchaseProductsSchemas from './PurchaseProductsSchemas';

class ShoppingsSchemas {
  // Schema for a single shopping
  static shoppingSchema = z.object({
    idShopping: z.number(),
    name:z.string(),
    idUser: z.number(),
    status: z.string(),
    createdIn: z.string(),
    updatedIn: z.string(),
    PurchaseProducts:z.array(PurchaseProductsSchemas.purchaseProductSchema)
  });

  // Schema for registering a shopping
  static RegisterShopping = z.object({
    idUser: z.number().int().positive("ID User must be a positive integer"),
  });

  // Schema for updating a shopping
  static UpdateShopping = z.object({
    idShopping: z.number().int().positive("ID User must be a positive integer"),
    status: z.string(),
  });

  // Schema for deleting a shopping
  static DeleteShopping = z.object({
    idShopping: z.number().int().positive("ID User must be a positive integer"),
  });

  // Schema for viewing a single shopping
  static ViewShopping = z.object({
    idShopping: z.number().int().positive("ID User must be a positive integer"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of shoppings
  static shoppingsResponseSchema = z.array(this.shoppingSchema);
}

export default ShoppingsSchemas;