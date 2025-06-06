import { file } from 'pdfkit';
import { z } from 'zod';

class ProductsSchemas {
  // Schema for a single product
  static productSchema = z.object({
    idProduct: z.number().optional(),
    name: z.string(),
    description: z.string(),
    priceInCents: z.number(),
    status: z.boolean(),
    category: z.string(),
    photo: z.string().nullable(),
    createdIn: z.date(),
    amount:z.number().nullable(),
    updatedIn: z.date(),
  });

  // Schema for registering a product
  static RegisterProduct = z.object({
    name: z.string(),
    description: z.string(),
    priceInCents: z.string(),
    status: z.string(),
    amount:z.string(),
    category: z.string(),
    file:z.any().optional()
  }).nullable();

  // Schema for updating a product
  static UpdateProduct = z.object({
    idProduct: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.string(),
    status: z.string(),
    amount:z.string(),
    category: z.string().min(1, "Category is required"),
    file:z.any().optional()
  }).nullable();

  // Schema for deleting a product
  static DeleteProduct = z.object({
    idProduct: z.number().int().positive("ID Product must be a positive integer"),
  });

  // Schema for viewing a single product
  static ViewProduct = z.object({
    idProduct: z.string(),
  });

  // Schema for viewing all products
  static ViewAllProducts = z.object({});

  // Schema for uploading a product photo
  static UploadPhotoProduct = z.object({
    idProduct: z.string(),
    photo: z.string().min(1, "Photo URL is required").optional(),
  }).nullable();

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of products
  static productsResponseSchema = z.array(this.productSchema);
}

export default ProductsSchemas;