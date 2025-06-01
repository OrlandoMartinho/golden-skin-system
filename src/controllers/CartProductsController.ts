import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import CartProductsSchemas from '../schemas/CartProductsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class CartProductsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = CartProductsSchemas.success_response;

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
    const validatedData = await this.zodError(CartProductsSchemas.RegisterCartProduct, data);
    const validatedKey = await this.zodError(CartProductsSchemas.tokenSchema, key);
    const {  idCart,idProduct, productName, priceInCents, status } = validatedData;
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
        throw new AuthorizationException('Not authorized to add products to this cart');
      }

      // Assuming a products table exists to validate idProduct
      const product = await prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new ItemNotFoundException('Product not found');
      }

      await prisma.cartProducts.create({
        data: {
          idCart,
          idProduct,
          productName,
          priceInCents,
          status,
          createdIn: new Date().toISOString(),
        },
      });

      return { message: 'Cart product registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register cart product');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(CartProductsSchemas.DeleteCartProduct, data);
    const validatedKey = await this.zodError(CartProductsSchemas.tokenSchema, key);
    const { idCartProduct } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

       const cartProduct = await prisma.cartProducts.findUnique({
        where: { idCartProduct:  idCartProduct  },
      });
      if (!cartProduct) {
        throw new ItemNotFoundException('Cart product not found');
      }

      const cart = await prisma.carts.findUnique({ where: { idCart:cartProduct.idCart as number } });
      if (!cart) {
        throw new ItemNotFoundException('Cart not found');
      }

      if (cart.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete products from this cart');
      }

     

      await prisma.cartProducts.delete({
        where: { idCartProduct:  idCartProduct  },
      });

      return { message: 'Cart product deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete cart product');
    }
  }

  public async response(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(CartProductsSchemas.ResponseCartProduct, data);
    const validatedKey = await this.zodError(CartProductsSchemas.tokenSchema, key);
    const { idCartProduct, status } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }
        const cartProduct = await prisma.cartProducts.findUnique({
        where: { idCartProduct:  idCartProduct  },
      });
      if (!cartProduct) {
        throw new ItemNotFoundException('Cart product not found');
      }

      const cart = await prisma.carts.findUnique({ where: { idCart:cartProduct.idCart as number } });
      if (!cart) {
        throw new ItemNotFoundException('Cart not found');
      }

      if (cart.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this cart product');
      }

    
      await prisma.cartProducts.update({
        where: { idCartProduct:  idCartProduct  },
        data: { status },
      });

      return { message: 'Cart product status updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update cart product status');
    }
  }

  public async viewA(data: any, key: any): Promise<z.infer<typeof CartProductsSchemas.cartProductSchema>> {
    const validatedData = await this.zodError(CartProductsSchemas.ViewCartProduct, data);
    const validatedKey = await this.zodError(CartProductsSchemas.tokenSchema, key);
    const {  idCartProduct} = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

       const cartProduct = await prisma.cartProducts.findUnique({
        where: { idCartProduct },
      });
      if (!cartProduct) {
        throw new ItemNotFoundException('Cart product not found');
      }

      const cart = await prisma.carts.findUnique({ where: { idCart:cartProduct.idCart as number } });
      if (!cart) {
        throw new ItemNotFoundException('Cart not found');
      }

      if (cart.idUser !== userId) {
        throw new AuthorizationException('Not authorized to view this cart product');
      }

      

      return CartProductsSchemas.cartProductSchema.parse(cartProduct);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve cart product');
    }
  }

  public async viewAll(data: any, key: any): Promise<z.infer<typeof CartProductsSchemas.cartProductsResponseSchema>> {
    const validatedData = await this.zodError(CartProductsSchemas.ViewCartProducts, data);
    const validatedKey = await this.zodError(CartProductsSchemas.tokenSchema, key);
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
        throw new AuthorizationException('Not authorized to view products in this cart');
      }

      const cartProducts = await prisma.cartProducts.findMany({ where: { idCart } });

      return CartProductsSchemas.cartProductsResponseSchema.parse(cartProducts);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve cart products');
    }
  }
}

export default CartProductsController;