import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import AppointmentsSchemas from '../schemas/AppointmentsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';
import NotificationsController from './NotificationsController';

class AppointmentsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = AppointmentsSchemas.success_response;
   private notification: NotificationsController = new NotificationsController();

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
    const validatedData = await this.zodError(AppointmentsSchemas.RegisterAppointment, data);
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { appointmentDate, appointmentTime, status, name, email, phoneNumber, idService } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({ where: { idUser:userId } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const service = await prisma.services.findUnique({where:{idService}})

      if(!service){
        throw new ItemNotFoundException("Service not found")
      }

      await prisma.appointments.create({
        data: {
          appointmentDate,
          appointmentTime,
          status,
          name,
          email,
          phoneNumber,
          employeeName: null,
          employeePhoneNumber: null,
          employeeEmail: null,
          idService,
          idUser:userId,
          createdIn: new Date().toISOString(),
          updatedIn: new Date().toISOString(),
        },
      });

      await prisma.services.update({where:{idService},data:{
        schedulingLimit:service.schedulingLimit-1
      }})
      const adminUser = await prisma.users.findFirst({ where: { role: 0 } });
      if (adminUser) {
      await this.notification.add(`O usuário ${user.name} agendou um serviço na data "${appointmentDate}" às "${appointmentTime}"`, adminUser.idUser);

      }
      return { message: 'Appointment registered successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register appointment');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(AppointmentsSchemas.UpdateAppointment, data);
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { idAppointment, appointmentDate, appointmentTime, status, name, email, phoneNumber } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({ where: { idUser:userId } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const appointment = await prisma.appointments.findUnique({ where: { idAppointment } });
      if (!appointment) {
        throw new ItemNotFoundException('Appointment not found');
      }

      if (appointment.idUser !== userId) {
        throw new AuthorizationException('Not authorized to update this appointment');
      }

      await prisma.appointments.update({
        where: { idAppointment },
        data: { appointmentDate, appointmentTime, status, name, email, phoneNumber, updatedIn: new Date().toISOString() },
      });
      const adminUser = await prisma.users.findFirst({ where: { role: 0 } });
      if (adminUser) {
      await this.notification.add(`O usuário ${user.name} actualizou um serviço da data "${appointment.appointmentDate}" às "${appointment.appointmentTime}"`, adminUser.idUser);

      }
      return { message: 'Appointment updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update appointment');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(AppointmentsSchemas.DeleteAppointment, data);
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { idAppointment } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const appointment = await prisma.appointments.findUnique({ where: { idAppointment } });
      if (!appointment) {
        throw new ItemNotFoundException('Appointment not found');
      }
      const user = await prisma.users.findUnique({ where: { idUser:userId } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }
      if (appointment.idUser !== userId) {
        throw new AuthorizationException('Not authorized to delete this appointment');
      }

      await prisma.appointments.delete({ where: { idAppointment } });
      const adminUser = await prisma.users.findFirst({ where: { role: 0 } });
      if (adminUser) {
      await this.notification.add(`O usuário ${user.name} cancelou um serviço da data "${appointment.appointmentDate}" às "${appointment.appointmentTime}"`, adminUser.idUser);

      }
      return { message: 'Appointment deleted successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete appointment');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof AppointmentsSchemas.appointmentsResponseSchema>> {
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const appointments = await prisma.appointments.findMany({ where: { idUser:userId } });

      return AppointmentsSchemas.appointmentsResponseSchema.parse(appointments);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve appointments');
    }
  }

  public async viewEmployee(data: any, key: any): Promise<z.infer<typeof AppointmentsSchemas.appointmentSchema>> {
    const validatedData = await this.zodError(AppointmentsSchemas.ViewEmployeeAppointment, data);
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { idAppointment } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const appointment = await prisma.appointments.findUnique({ where: { idAppointment } });
      if (!appointment) {
        throw new ItemNotFoundException('Appointment not found');
      }

      // Assuming employees have access to all appointments for simplicity; adjust logic as needed
      return AppointmentsSchemas.appointmentSchema.parse(appointment);
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve appointment for employee');
    }
  }

  public async addEmployee(data: any, key: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = await this.zodError(AppointmentsSchemas.AddEmployeeAppointment, data);
    const validatedKey = await this.zodError(AppointmentsSchemas.tokenSchema, key);
    const { idAppointment, employeeName, employeePhoneNumber, employeeEmail } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const appointment = await prisma.appointments.findUnique({ where: { idAppointment } });
      if (!appointment) {
        throw new ItemNotFoundException('Appointment not found');
      }

      // Assuming only admin or specific employee role can add employee details; adjust logic as needed
      await prisma.appointments.update({
        where: { idAppointment },
        data: { employeeName, employeePhoneNumber, employeeEmail, updatedIn: new Date().toISOString() },
      });

      return { message: 'Employee added to appointment successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to add employee to appointment');
    }
  }
}

export default AppointmentsController;