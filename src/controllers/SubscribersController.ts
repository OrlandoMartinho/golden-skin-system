import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import SubscribersSchemas from '../schemas/SubscribersSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class SubscribersController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = SubscribersSchemas.success_response;

  private async zodError(schema: z.ZodSchema, data: any): Promise<any> {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidDataException(error.errors.map(e => e.message).join(', '));
      }
      throw error;
    }
  }

  public async registerSubscriber(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(SubscribersSchemas.RegisterSubscriber, data);
    const validatedKey = await this.zodError(SubscribersSchemas.tokenSchema, key);
    const { subscriberName, idUser,idPlan } = validatedData;
    const { token } = validatedKey;

    try {
      const currentUserId = await this.tokenService.userId(token);
      if (!currentUserId) {
        throw new AuthorizationException('Not authorized');
      }
      if (currentUserId !== idUser) {
        throw new AuthorizationException('Not authorized to create subscriber for this user');
      }

      await prisma.subscribers.create({
        data: {
          subscriberName,
          idUser,
          idPlan,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Subscriber registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register subscriber');
    }
  }

  public async deleteSubscriber(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(SubscribersSchemas.DeleteSubscriber, data);
    const validatedKey = await this.zodError(SubscribersSchemas.tokenSchema, key);
    const { idSubscriber } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const subscriber = await prisma.subscribers.findUnique({ where: { idSubscriber } });
      if (!subscriber) {
        throw new ItemNotFoundException('Subscriber not found');
      }
      if (subscriber.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this subscriber');
      }

      await prisma.subscribers.delete({ where: { idSubscriber } });

      return { message: 'Subscriber deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete subscriber');
    }
  }

  public async updateSubscriber(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(SubscribersSchemas.UpdateSubscriber, data);
    const validatedKey = await this.zodError(SubscribersSchemas.tokenSchema, key);
    const { idSubscriber, subscriberName } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const subscriber = await prisma.subscribers.findUnique({ where: { idSubscriber } });
      if (!subscriber) {
        throw new ItemNotFoundException('Subscriber not found');
      }
      if (subscriber.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this subscriber');
      }

      await prisma.subscribers.update({
        where: { idSubscriber },
        data: { subscriberName, updatedIn: new Date().toISOString() },
      });

      return { message: 'Subscriber updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update subscriber');
    }
  }

  public async viewSubscriber(data: any, key: any): Promise<z.infer<typeof SubscribersSchemas.subscriberSchema>> {
    const validatedData = await this.zodError(SubscribersSchemas.ViewSubscriber, data);
    const validatedKey = await this.zodError(SubscribersSchemas.tokenSchema, key);
    const { idSubscriber } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const subscriber = await prisma.subscribers.findUnique({ where: { idSubscriber } });
      if (!subscriber) {
        throw new ItemNotFoundException('Subscriber not found');
      }
      if (subscriber.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this subscriber');
      }

      return SubscribersSchemas.subscriberSchema.parse(subscriber);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve subscriber');
    }
  }
  public async viewAllSubscribers(data: any, key: any): Promise<z.infer<typeof SubscribersSchemas.subscribersResponseSchema>> {
    const validatedKey = await this.zodError(SubscribersSchemas.tokenSchema, key);

    try {
      const userId = await this.tokenService.userId(validatedKey.token);
      const userRole = await this.tokenService.userRole(validatedKey.token);

      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const subscribers = await prisma.subscribers.findMany({
        where: userRole === 0 ? undefined : { idUser: userId }
      });

      return SubscribersSchemas.subscribersResponseSchema.parse(subscribers);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred when trying to retrieve subscribers');
    }
  }
}

export default SubscribersController;