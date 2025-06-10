import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ShoppingsSchemas from '../schemas/ShoppingsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class ShoppingsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = ShoppingsSchemas.success_response;

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

  public async register(data: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ShoppingsSchemas.RegisterShopping, data);
    const { idUser } = validatedData;

    try {
      const user = await prisma.users.findUnique({ where: { idUser } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      await prisma.shoppings.create({
        data: {
          idUser,
          status: "pendente",
          name:user.name,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Shopping registered successfully' };
    } catch (error) {
      if (error instanceof ItemNotFoundException || error instanceof InvalidDataException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register shopping');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ShoppingsSchemas.UpdateShopping, data);
    const validatedKey = await this.zodError(ShoppingsSchemas.tokenSchema, key);
    const { idShopping, status } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping } });
      if (!shopping) {
        throw new ItemNotFoundException('Shopping not found');
      }

      if (shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this shopping');
      }

      await prisma.shoppings.update({
        where: { idShopping },
        data: { status,
            updatedIn: new Date().toISOString()
        },
      });

      return { message: 'Shopping updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update shopping');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(ShoppingsSchemas.DeleteShopping, data);
    const validatedKey = await this.zodError(ShoppingsSchemas.tokenSchema, key);
    const { idShopping } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping:idShopping } });
      if (!shopping) {
        throw new ItemNotFoundException('Shopping not found');
      }

      if (shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this shopping');
      }

      await prisma.shoppings.delete({ where: { idShopping } });

      return { message: 'Shopping deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete shopping');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof ShoppingsSchemas.shoppingSchema>> {
    const validatedData = await this.zodError(ShoppingsSchemas.ViewShopping, data);
    const validatedKey = await this.zodError(ShoppingsSchemas.tokenSchema, key);
    const { idUser,idShopping } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping } ,include:{
        PurchaseProducts: true,
      }});
      if (!shopping) {
        throw new ItemNotFoundException('Shopping not found');
      }

      if (shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this shopping');
      }

      return ShoppingsSchemas.shoppingSchema.parse(shopping);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve shopping');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof ShoppingsSchemas.shoppingsResponseSchema>> {
    const validatedKey = await this.zodError(ShoppingsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const userRole = await this.tokenService.userRole(token)

      

     const shoppings = await prisma.shoppings.findMany({
      where: userRole !== 0 ? { idUser: userId } : undefined,
      include: {
        PurchaseProducts: true,
      },
    });
     console.log(shoppings)
    return ShoppingsSchemas.shoppingsResponseSchema.parse(shoppings);

    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      console.log("Error:",error)
      throw new InternalServerErrorException('An error occurred when trying to retrieve shoppings');
    }
  }
}

export default ShoppingsController;