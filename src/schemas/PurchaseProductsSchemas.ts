import { z } from 'zod';

class PurchaseProductsSchemas {
  // Schema for a single purchase product
  static purchaseProductSchema = z.object({
    idPurchaseProduct: z.number().optional(),
    idShopping: z.number(),
    idProduct: z.number(),
    priceInCents: z.number(),
    productName: z.string(),
    paymentMethod: z.string(),
    createdIn: z.string(),
    updatedIn: z.string(),
  });

  // Schema for registering a purchase product
  static RegisterPurchaseProduct = z.object({
    idShopping: z.number().int().positive("ID Shopping must be a positive integer"),
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
    productName: z.string().min(1, "Product name is required"),
    paymentMethod: z.string().min(1, "Payment method is required"),
  });

  // Schema for updating a purchase product
  static UpdatePurchaseProduct = z.object({
    idPurchaseProduct: z.number().int().positive("ID Purchase Product must be a positive integer"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
    paymentMethod: z.string().min(1, "Payment method is required"),
  });

  // Schema for deleting a purchase product
  static DeletePurchaseProduct = z.object({
    idPurchaseProduct: z.number().int().positive("ID Purchase Product must be a positive integer"),
  });

  // Schema for viewing a single purchase product
  static ViewPurchaseProduct = z.object({
    idPurchaseProduct: z.number().int().positive("ID Purchase Product must be a positive integer"),
  });

  // Schema for viewing all purchase products in a shopping
  static ViewPurchaseProducts = z.object({
    idShopping: z.number().int().positive("ID Shopping must be a positive integer"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of purchase products
  static purchaseProductsResponseSchema = z.array(this.purchaseProductSchema);
}

export default PurchaseProductsSchemas;