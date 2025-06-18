import { z } from 'zod';

class CartProductsSchemas {
  // Schema for a single cart product
  static cartProductSchema = z.object({
    idCartProduct: z.number(),
    idCart: z.number().nullable(),
    idProduct: z.number().nullable(),
    productName: z.string().nullable(),
    priceInCents: z.number().nullable(),
    status: z.boolean(),
    createdIn: z.date().nullable(),
    productPhoto: z.string().nullable(),
  });



 

 

  // Schema for registering a cart product
  static RegisterCartProduct = z.object({
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
  });

  // Schema for deleting a cart product
  static DeleteCartProduct = z.object({
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