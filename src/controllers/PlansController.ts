import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import PlansSchemas from '../schemas/PlansSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';

class PlansController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = PlansSchemas.success_response;

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

  public async registerPlan(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(PlansSchemas.RegisterPlan, data);
    const validatedKey = await this.zodError(PlansSchemas.tokenSchema, key);
    const { description, services, priceInCents,type,name ,status} = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      await prisma.plans.create({
        data: {
          description,
          services,
          priceInCents,
          type,
          name,
          status,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      return { message: 'Plan registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register plan');
    }
  }

  public async deletePlan(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(PlansSchemas.DeletePlan, data);
    const validatedKey = await this.zodError(PlansSchemas.tokenSchema, key);
    const { idPlan } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const plan = await prisma.plans.findUnique({ where: { idPlan } });
      if (!plan) {
        throw new ItemNotFoundException('Plan not found');
      }

      await prisma.plans.delete({ where: { idPlan } });

      return { message: 'Plan deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete plan');
    }
  }

  public async updatePlan(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(PlansSchemas.UpdatePlan, data);
    const validatedKey = await this.zodError(PlansSchemas.tokenSchema, key);
    const { idPlan, description, services, priceInCents ,type,name, status} = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const plan = await prisma.plans.findUnique({ where: { idPlan } });
      if (!plan) {
        throw new ItemNotFoundException('Plan not found');
      }

      await prisma.plans.update({
        where: { idPlan },
        data: { description, services, priceInCents, updatedIn: new Date().toISOString() ,type,name, status},
      });

      return { message: 'Plan updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update plan');
    }
  }

  public async viewPlan(data: any, key: any): Promise<z.infer<typeof PlansSchemas.planSchema>> {
    const validatedData = await this.zodError(PlansSchemas.ViewPlan, data);
    const validatedKey = await this.zodError(PlansSchemas.tokenSchema, key);
    const { idPlan } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const plan = await prisma.plans.findUnique({ where: { idPlan:Number(idPlan) } });
      if (!plan) {
        throw new ItemNotFoundException('Plan not found');
      }

      return PlansSchemas.planSchema.parse(plan);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve plan');
    }
  }

  public async viewAllPlans(data: any, key: any): Promise<z.infer<typeof PlansSchemas.plansResponseSchema>> {
    const validatedKey = await this.zodError(PlansSchemas.tokenSchema, key);

    try {
      const userId = await this.tokenService.userId(validatedKey.token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const plans = await prisma.plans.findMany();
  
      return PlansSchemas.plansResponseSchema.parse(plans);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
       
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve plans');
    }
  }
}

export default PlansController;