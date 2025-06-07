import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ServicesSchemas from '../schemas/ServicesSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';
import FileService from '../services/StorageServices';
import path from 'path';
import { FastifyRequest } from 'fastify';

class ServicesController {
  private readonly tokenService: TokenService = new TokenService();
  private readonly fileService: FileService = new FileService();
  private readonly responseSchema = ServicesSchemas.success_response;

  private async validateSchema<T>(schema: z.ZodSchema<T>, data: any): Promise<T> {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidDataException(
          error.errors.map(e => e.message).join(', ')
        );
      }
      throw error;
    }
  }

  private async verifyAuthorization(token: string): Promise<number> {
    const userId = await this.tokenService.userId(token);
    if (!userId) {
      throw new AuthorizationException('Not authorized');
    }
    return userId;
  }

  public async add(
    data: any,
    key: any,
    file: any
  ): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.validateSchema(ServicesSchemas.AddService, data);
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { name, description, priceInCents, benefits, reviews, status, duration } = validatedData;
    const { token } = validatedKey;

    try {
      await this.verifyAuthorization(token);

      let fileName: string | null = null;
      if (file) {
        const fileBuffer = await file.toBuffer();
        fileName = Date.now() + path.extname(file.filename);
        await this.fileService.saveFile(fileBuffer, fileName, 'services/');
      }

      await prisma.services.create({
        data: {
          name,
          description,
          priceInCents: Number(priceInCents),
          benefits,
          reviews,
          status: Boolean(status),
          duration: Number(duration),
          photo: fileName,
          createdIn: new Date(),
          updatedIn: new Date(),
        },
      });

      return { message: 'Service added successfully' };
    } catch (error) {
      console.error('[ADD] Error:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add service');
    }
  }

  public async edit(
    data: any,
    key: any,
    file: any
  ): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.validateSchema(ServicesSchemas.EditService, data);
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { idService, name, description, priceInCents, benefits, reviews, status, duration } = validatedData;
    const { token } = validatedKey;

    try {
      await this.verifyAuthorization(token);

      const service = await prisma.services.findUnique({
        where: { idService: Number(idService) },
      });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      let fileName = service.photo;
      if (file) {
        const fileBuffer = await file.toBuffer();
        fileName = Date.now() + path.extname(file.filename);
        await this.fileService.saveFile(fileBuffer, fileName, 'services/');
      }

      await prisma.services.update({
        where: { idService: Number(idService) },
        data: {
          name,
          description,
          priceInCents: Number(priceInCents),
          benefits,
          reviews,
          status: Boolean(status),
          duration: Number(duration),
          photo: fileName,
          updatedIn: new Date(),
        },
      });

      return { message: 'Service updated successfully' };
    } catch (error) {
      console.error('[EDIT] Error:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update service');
    }
  }

  public async delete(
    data: any,
    key: any
  ): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.validateSchema(ServicesSchemas.DeleteService, data);
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { idService } = validatedData;
    const { token } = validatedKey;

    try {
      await this.verifyAuthorization(token);

      const service = await prisma.services.findUnique({
        where: { idService: Number(idService) },
      });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      await prisma.services.delete({
        where: { idService: Number(idService) },
      });

      return { message: 'Service deleted successfully' };
    } catch (error) {
      console.error('[DELETE] Error:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete service');
    }
  }

  public async viewA(
    data: any,
    key: any,
    req: FastifyRequest
  ): Promise<z.infer<typeof ServicesSchemas.serviceSchema>> {
    const validatedData = await this.validateSchema(ServicesSchemas.ViewService, data);
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { idService } = validatedData;
    const { token } = validatedKey;

    try {
      await this.verifyAuthorization(token);

      const service = await prisma.services.findUnique({
        where: { idService: Number(idService) },
      });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      if (service.photo) {
        service.photo = this.fileService.generateLink('services', req, service.photo);
      }

      return ServicesSchemas.serviceSchema.parse(service);
    } catch (error) {
      console.error('[VIEWA] Error:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve service');
    }
  }

  public async viewAll(
    key: any,
    req: FastifyRequest
  ): Promise<z.infer<typeof ServicesSchemas.servicesResponseSchema>> {
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      await this.verifyAuthorization(token);

      const services = await prisma.services.findMany();

      const servicesWithLinks = services.map(service => ({
        ...service,
        photo: service.photo
          ? this.fileService.generateLink('services', req, service.photo)
          : null,
      }));

      return ServicesSchemas.servicesResponseSchema.parse(servicesWithLinks);
    } catch (error) {
      console.error('[VIEWALL] Error:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve services');
    }
  }

  public async uploadPhoto(
    file: any,
    data: any,
    key: any
  ): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.validateSchema(ServicesSchemas.UploadPhotoService, data);
    const validatedKey = await this.validateSchema(ServicesSchemas.tokenSchema, key);
    const { idService } = validatedData;
    const { token } = validatedKey;

    try {
      if (!(await this.tokenService.checkTokenUser(token))) {
        throw new AuthorizationException('Not authorized');
      }

      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new InvalidDataException('Invalid ID');
      }

      const service = await prisma.services.findUnique({
        where: { idService: Number(idService) },
      });
      if (!service) {
        throw new ItemNotFoundException('Service not found');
      }

      if (!file) {
        throw new InvalidDataException('File not provided');
      }

      const fileBuffer = await file.toBuffer();
      const fileName = Date.now() + path.extname(file.filename);
      await this.fileService.saveFile(fileBuffer, fileName, 'services/');

      await prisma.services.update({
        where: { idService: Number(idService) },
        data: { photo: fileName, updatedIn: new Date() },
      });

      return { message: 'Service photo uploaded successfully' };
    } catch (error) {
      console.error('[UPLOAD] Error:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload service photo');
    }
  }
}

export default ServicesController;