import { end } from 'pdfkit';
import { start } from 'repl';
import { z } from 'zod';

class SubscribersSchemas {
  // Schema for a single subscriber
  static subscriberSchema = z.object({
    idSubscriber: z.number(),
    subscriberName: z.string(),
    idUser: z.number(),
    idPlan:z.number(),
    planName: z.string().nullable(),
    email: z.string().email("Invalid email format").nullable(),
    createdIn: z.date(),
    updatedIn: z.date().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    status: z.boolean().nullable(),
  });



  // Schema for registering a subscriber
  static RegisterSubscriber = z.object({
    idPlan:z.number(),
    email: z.string().email("Invalid email format").min(1, "Email is required").optional(),
    startDate: z.string().min(1, "Start date is required").optional(),
    endDate: z.string().min(1, "End date is required").optional(),
    subscriberName: z.string().min(1, "Subscriber name is required").optional(),
  });

  // Schema for deleting a subscriber
  static DeleteSubscriber = z.object({
    idSubscriber: z.number().int().positive("Subscriber ID must be a positive integer"),
  });

  // Schema for updating a subscriber
  static UpdateSubscriber = z.object({
    idPlan:z.number(),
    startDate: z.string().min(1, "Start date is required").optional(),
    subscriberName: z.string().min(1, "Subscriber name is required").optional(),
    status: z.boolean().optional(),
    idSubscriber: z.number().int().positive("Subscriber ID must be a positive integer"),
  });

  // Schema for viewing a single subscriber
  static ViewSubscriber = z.object({
    idSubscriber: z.string().min(1, "Subscriber ID is required")  ,
  });

  // Schema for viewing all subscribers
  static ViewSubscribers = z.object({});

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of subscribers
  static subscribersResponseSchema = z.array(this.subscriberSchema);
}

export default SubscribersSchemas;