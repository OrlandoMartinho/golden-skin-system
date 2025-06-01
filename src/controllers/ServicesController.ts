import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ServicesSchemas from '../schemas/ServicesSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class ServicesController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = ServicesSchemas.success_response;

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

  public async add(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ServicesSchemas.AddService, data);
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { name, description, priceInCents, benefits, reviews, status, duration } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      await prisma.services.create({
        data: {
          name,
          description,
          priceInCents,
          benefits,
          reviews,
          status,
          duration,
          photo: null,
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Service added successfully' };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to add service');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ServicesSchemas.DeleteService, data);
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { idService } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const service = await prisma.services.findUnique({ where: { idService } });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      await prisma.services.delete({ where: { idService } });

      return { message: 'Service deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete service');
    }
  }

  public async edit(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ServicesSchemas.EditService, data);
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { idService, name, description, priceInCents, benefits, reviews, status, duration } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const service = await prisma.services.findUnique({ where: { idService } });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      await prisma.services.update({
        where: { idService },
        data: { name, description, priceInCents, benefits, reviews, status, duration, updatedIn: new Date().toISOString() },
      });

      return { message: 'Service edited successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to edit service');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof ServicesSchemas.serviceSchema>> {
    const validatedData = await this.zodError(ServicesSchemas.ViewService, data);
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { idService } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const service = await prisma.services.findUnique({ where: { idService } });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      return ServicesSchemas.serviceSchema.parse(service);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve service');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof ServicesSchemas.servicesResponseSchema>> {
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const services = await prisma.services.findMany();

      return ServicesSchemas.servicesResponseSchema.parse(services);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve services');
    }
  }

  public async uploadPhoto(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ServicesSchemas.UploadPhotoService, data);
    const validatedKey = await this.zodError(ServicesSchemas.tokenSchema, key);
    const { idService, photo } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const service = await prisma.services.findUnique({ where: { idService } });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      await prisma.services.update({
        where: { idService },
        data: { photo, updatedIn: new Date().toISOString() },
      });

      return { message: 'Service photo uploaded successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to upload service photo');
    }
  }
}

export default ServicesController;