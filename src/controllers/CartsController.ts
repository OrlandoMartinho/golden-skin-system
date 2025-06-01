import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import CartsSchemas from '../schemas/CartsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class CartsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = CartsSchemas.success_response;

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
    const validatedData = await this.zodError(CartsSchemas.AddCart, data);
    const validatedKey = await this.zodError(CartsSchemas.tokenSchema, key);
    const { idUser, status } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      if (userId !== idUser) {
        throw new AuthorizationException('Not authorized to create a cart for another user');
      }

      const user = await prisma.users.findUnique({ where: { idUser } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      await prisma.carts.create({
        data: {
          idUser,
          status,
        },
      });

      return { message: 'Cart added successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to add cart');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(CartsSchemas.DeleteCart, data);
    const validatedKey = await this.zodError(CartsSchemas.tokenSchema, key);
    const { idCart } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const cart = await prisma.carts.findUnique({ where: { idCart } });
      if (!cart) {
        throw new ItemNotFoundException('Cart not found');
      }

      if (cart.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this cart');
      }

      await prisma.carts.delete({ where: { idCart } });

      return { message: 'Cart deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete cart');
    }
  }

  public async viewA(params: any, key: any): Promise<z.infer<typeof CartsSchemas.cartSchema>> {
    const validatedParams = await this.zodError(CartsSchemas.ViewCart, params);
    const validatedKey = await this.zodError(CartsSchemas.tokenSchema, key);
    const { idCart } = validatedParams;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const cart = await prisma.carts.findUnique({ where: { idCart } });
      if (!cart) {
        throw new ItemNotFoundException('Cart not found');
      }

      if (cart.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this cart');
      }

      return CartsSchemas.cartSchema.parse(cart);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve cart');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof CartsSchemas.cartsResponseSchema>> {
    const validatedKey = await this.zodError(CartsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const carts = await prisma.carts.findMany({ where: { idUser: userId } });

      return CartsSchemas.cartsResponseSchema.parse(carts);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve carts');
    }
  }
}

export default CartsController;