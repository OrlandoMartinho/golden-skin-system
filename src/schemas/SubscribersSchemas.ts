import { z } from 'zod';

class SubscribersSchemas {
  // Schema for a single subscriber
  static subscriberSchema = z.object({
    idSubscriber: z.number(),
    subscriberName: z.string(),
    idUser: z.number(),
    idPlan:z.number(),
    createdIn: z.string(),
    updatedIn: z.string(),
  });

  // Schema for registering a subscriber
  static RegisterSubscriber = z.object({
    idPlan:z.number(),
  });

  // Schema for deleting a subscriber
  static DeleteSubscriber = z.object({
    idSubscriber: z.number().int().positive("Subscriber ID must be a positive integer"),
  });

  // Schema for updating a subscriber
  static UpdateSubscriber = z.object({
    idPlan:z.number(),
  });

  // Schema for viewing a single subscriber
  static ViewSubscriber = z.object({
    idSubscriber: z.number().int().positive("Subscriber ID must be a positive integer"),
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