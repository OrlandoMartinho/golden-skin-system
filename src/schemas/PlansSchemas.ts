import { z } from 'zod';

class PlansSchemas {
  // Schema for a single plan
  static planSchema = z.object({
    idPlan: z.number(),
    description: z.string(),
    services: z.string(),
    priceInCents: z.number(),
    name:z.string(),
    type:z.string(),
    status:z.boolean(),
    createdIn: z.date(),
    updatedIn: z.date().nullable(),
  });

   

  // Schema for registering a plan
  static RegisterPlan = z.object({
    description: z.string().min(1, "Description is required"),
    services: z.string().min(1, "Services text is required"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
    name:z.string(),
    status:z.boolean(),
    type:z.string(),
  });

  // Schema for deleting a plan
  static DeletePlan = z.object({
    idPlan: z.number().int().positive("Plan ID must be a positive integer"),
  });

  // Schema for updating a plan
  static UpdatePlan = z.object({
    idPlan: z.number().int().positive("Plan ID must be a positive integer"),
    description: z.string().min(1, "Description is required"),
    services: z.string().min(1, "Services text is required"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
    name:z.string(),
    type:z.string(),
    status:z.boolean()
  });

  // Schema for viewing a single plan
  static ViewPlan = z.object({
    idPlan: z.string(),
  });

  // Schema for viewing all plans
  static ViewPlans = z.object({});

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of plans
  static plansResponseSchema = z.array(this.planSchema);
}

export default PlansSchemas;