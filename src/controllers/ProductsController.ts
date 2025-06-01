import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ProductsSchemas from '../schemas/ProductsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class ProductsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = ProductsSchemas.success_response;

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

  public async register(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ProductsSchemas.RegisterProduct, data);
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { name, description, priceInCents, status, category } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      await prisma.products.create({
        data: {
          name,
          description,
          priceInCents,
          status,
          category,
          photo: null,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Product registered successfully' };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register product');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ProductsSchemas.UpdateProduct, data);
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { idProduct, name, description, priceInCents, status, category } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      await prisma.products.update({
        where: { idProduct },
        data: { name, description, priceInCents, status, category, updatedIn: new Date().toISOString() },
      });

      return { message: 'Product updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update product');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ProductsSchemas.DeleteProduct, data);
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { idProduct } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      await prisma.products.delete({ where: { idProduct } });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete product');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof ProductsSchemas.productSchema>> {
    const validatedData = await this.zodError(ProductsSchemas.ViewProduct, data);
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { idProduct } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      return ProductsSchemas.productSchema.parse(product);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve product');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof ProductsSchemas.productsResponseSchema>> {
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const products = await prisma.products.findMany();

      return ProductsSchemas.productsResponseSchema.parse(products);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve products');
    }
  }

  public async uploadPhoto(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ProductsSchemas.UploadPhotoProduct, data);
    const validatedKey = await this.zodError(ProductsSchemas.tokenSchema, key);
    const { idProduct, photo } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      await prisma.products.update({
        where: { idProduct },
        data: { photo, updatedIn: new Date().toISOString() },
      });

      return { message: 'Product photo uploaded successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to upload product photo');
    }
  }
}

export default ProductsController;