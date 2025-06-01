import { z } from 'zod';

class CartProductsSchemas {
  // Schema for a single cart product
  static cartProductSchema = z.object({
    idCart: z.number(),
    idProduct: z.number(),
    description: z.string(),
    productName: z.string(),
    priceInCents: z.number(),
    status: z.boolean(),
    createdIn: z.string(),
  });

  // Schema for registering a cart product
  static RegisterCartProduct = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
    description: z.string().min(1, "Description is required"),
    productName: z.string().min(1, "Product name is required"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
    status: z.boolean(),
  });

  // Schema for deleting a cart product
  static DeleteCartProduct = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
  });

  // Schema for updating a cart product's status (response)
  static ResponseCartProduct = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
    status: z.boolean(),
  });

  // Schema for viewing a single cart product
  static ViewCartProduct = z.object({
    idCart: z.number().int().positive("ID Cart must be a positive integer"),
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
  });

  // Schema for viewing all cart products in a cart
  static ViewCartProducts = z.object({
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

  // Response schema for an array of cart products
  static cartProductsResponseSchema = z.array(this.cartProductSchema);
}

export default CartProductsSchemas;