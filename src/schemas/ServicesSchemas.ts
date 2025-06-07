import { z } from 'zod';

class ServicesSchemas {
  // Schema for a single service
  static serviceSchema = z.object({
    idService: z.number().optional(),
    name: z.string(),
    description: z.string(),
    priceInCents: z.number(),
    benefits: z.string(),
    reviews: z.number(),
    status: z.string(),
    duration: z.number(),
    photo: z.string().nullable(),
    updatedIn: z.string(),
  });

  // Schema for adding a service
  static AddService = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.string().min(1,"Price in cents must be a positive integer"),
    benefits: z.string().min(1, "Benefits are required"),
    reviews: z.string().min(1,"Reviews must be a non-negative number"),
    status: z.string().min(1, "Status is required"),
    duration: z.string().min(1,"Duration must be a positive integer"),
    file:z.any().optional()
  }).nullable();

  // Schema for deleting a service
  static DeleteService = z.object({
    idService: z.number().int().positive("ID Service must be a positive integer"),
  });

  // Schema for editing a service
  static EditService = z.object({
    idService: z.number().int().positive("ID Service must be a positive integer"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.string().min(1,"Price in cents must be a positive integer"),
    benefits: z.string().min(1, "Benefits are required"),
    reviews: z.string().min(1,"Reviews must be a non-negative number"),
    status: z.string().min(1, "Status is required"),
    duration: z.string().min(1,"Duration must be a positive integer"),
    file:z.any().optional()
  });

  // Schema for viewing a single service
  static ViewService = z.object({
    idService: z.number().int().positive("ID Service must be a positive integer"),
  });

  // Schema for viewing all services
  static ViewAllServices = z.object({});

  // Schema for uploading a service photo
  static UploadPhotoService = z.object({
    idService: z.number().int().positive("ID Service must be a positive integer"),
    photo: z.string().min(1, "Photo URL is required"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of services
  static servicesResponseSchema = z.array(this.serviceSchema);
}

export default ServicesSchemas;