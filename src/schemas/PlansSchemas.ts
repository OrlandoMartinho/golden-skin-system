import { z } from 'zod';

class PlansSchemas {
  // Schema for a single plan
  static planSchema = z.object({
    idPlan: z.number(),
    description: z.string(),
    servicesText: z.string(),
    priceInCents: z.number(),
    createdIn: z.string(),
    updatedIn: z.string(),
  });

  // Schema for registering a plan
  static RegisterPlan = z.object({
    description: z.string().min(1, "Description is required"),
    servicesText: z.string().min(1, "Services text is required"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
  });

  // Schema for deleting a plan
  static DeletePlan = z.object({
    idPlan: z.number().int().positive("Plan ID must be a positive integer"),
  });

  // Schema for updating a plan
  static UpdatePlan = z.object({
    idPlan: z.number().int().positive("Plan ID must be a positive integer"),
    description: z.string().min(1, "Description is required"),
    servicesText: z.string().min(1, "Services text is required"),
    priceInCents: z.number().int().positive("Price in cents must be a positive integer"),
  });

  // Schema for viewing a single plan
  static ViewPlan = z.object({
    idPlan: z.number().int().positive("Plan ID must be a positive integer"),
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