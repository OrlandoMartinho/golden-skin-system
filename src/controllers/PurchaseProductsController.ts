import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import PurchaseProductsSchemas from '../schemas/PurchaseProductsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class PurchaseProductsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = PurchaseProductsSchemas.success_response;

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
    const validatedData = await this.zodError(PurchaseProductsSchemas.RegisterPurchaseProduct, data);
    const validatedKey = await this.zodError(PurchaseProductsSchemas.tokenSchema, key);
    const { idShopping, idProduct, priceInCents, productName, paymentMethod } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping: idShopping } });
      if (!shopping) {
        throw new ItemNotFoundException('Shopping not found');
      }

      if (shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to add purchases to this shopping');
      }

      // Assuming a products table exists to validate idProduct
      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      await prisma.purchaseProducts.create({
        data: {
          idShopping,
          idProduct,
          priceInCents,
          productName,
          paymentMethod,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Purchase product registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register purchase product');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(PurchaseProductsSchemas.UpdatePurchaseProduct, data);
    const validatedKey = await this.zodError(PurchaseProductsSchemas.tokenSchema, key);
    const { idPurchaseProduct, priceInCents, paymentMethod } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const purchaseProduct = await prisma.purchaseProducts.findUnique({ where: { idPurchaseProduct } });
      if (!purchaseProduct) {
        throw new ItemNotFoundException('Purchase product not found');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping: purchaseProduct.idShopping  as  number} });
      if (!shopping || shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this purchase product');
      }

      await prisma.purchaseProducts.update({
        where: { idPurchaseProduct },
        data: { priceInCents, paymentMethod, updatedIn: new Date().toISOString() },
      });

      return { message: 'Purchase product updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update purchase product');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(PurchaseProductsSchemas.DeletePurchaseProduct, data);
    const validatedKey = await this.zodError(PurchaseProductsSchemas.tokenSchema, key);
    const { idPurchaseProduct } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const purchaseProduct = await prisma.purchaseProducts.findUnique({ where: { idPurchaseProduct } });
      if (!purchaseProduct) {
        throw new ItemNotFoundException('Purchase product not found');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping: purchaseProduct.idShopping as number } });
      if (!shopping || shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this purchase product');
      }

      await prisma.purchaseProducts.delete({ where: { idPurchaseProduct } });

      return { message: 'Purchase product deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete purchase product');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof PurchaseProductsSchemas.purchaseProductSchema>> {
    const validatedData = await this.zodError(PurchaseProductsSchemas.ViewPurchaseProduct, data);
    const validatedKey = await this.zodError(PurchaseProductsSchemas.tokenSchema, key);
    const { idPurchaseProduct } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const purchaseProduct = await prisma.purchaseProducts.findUnique({ where: { idPurchaseProduct } });
      if (!purchaseProduct) {
        throw new ItemNotFoundException('Purchase product not found');
      }

      const shopping = await prisma.shoppings.findUnique({ where: { idShopping: purchaseProduct.idShopping as number } });
      if (!shopping || shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this purchase product');
      }

      return PurchaseProductsSchemas.purchaseProductSchema.parse(purchaseProduct);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve purchase product');
    }
  }

  public async viewAll(data: any, key: any): Promise<z.infer<typeof PurchaseProductsSchemas.purchaseProductsResponseSchema>> {
    const validatedData = await this.zodError(PurchaseProductsSchemas.ViewPurchaseProducts, data);
    const validatedKey = await this.zodError(PurchaseProductsSchemas.tokenSchema, key);
    const { idShopping } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const shopping = await prisma.shoppings.findUnique({ where: {idShopping } });
      if (!shopping || shopping.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view purchases in this shopping');
      }

      const purchaseProducts = await prisma.purchaseProducts.findMany({ where: { idShopping } });

      return PurchaseProductsSchemas.purchaseProductsResponseSchema.parse(purchaseProducts);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve purchase products');
    }
  }
}

export default PurchaseProductsController;