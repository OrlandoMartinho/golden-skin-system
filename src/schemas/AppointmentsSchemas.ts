import { z } from 'zod';

class AppointmentsSchemas {
  // Schema for a single appointment
  static appointmentSchema = z.object({
    idAppointment: z.number().optional(),
    appointmentDate: z.string(),
    appointmentTime: z.string(),
    status: z.boolean(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    employeeName: z.string().nullable(),
    employeePhoneNumber: z.string().nullable(),
    employeeEmail: z.string().nullable(),
    idService: z.number(),
    idUser: z.number(),
    createdIn: z.string(),
    updatedIn: z.string(),
  });

  // Schema for registering an appointment
  static RegisterAppointment = z.object({
    appointmentDate: z.string().min(1, "Appointment date is required"),
    appointmentTime: z.string().min(1, "Appointment time is required"),
    status: z.boolean(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    idService: z.number().int().positive("ID Service must be a positive integer"),
  });

  // Schema for updating an appointment
  static UpdateAppointment = z.object({
    idAppointment: z.number().int().positive("ID Appointment must be a positive integer"),
    appointmentDate: z.string().min(1, "Appointment date is required"),
    appointmentTime: z.string().min(1, "Appointment time is required"),
    status: z.boolean(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  });

  // Schema for deleting an appointment
  static DeleteAppointment = z.object({
    idAppointment: z.number().int().positive("ID Appointment must be a positive integer"),
  });

  // Schema for viewing all appointments
  static ViewAllAppointments = z.object({});

  // Schema for viewing an appointment for an employee
  static ViewEmployeeAppointment = z.object({
    idAppointment: z.number().int().positive("ID Appointment must be a positive integer"),
  });

  // Schema for adding an employee to an appointment
  static AddEmployeeAppointment = z.object({
    idAppointment: z.number().int().positive("ID Appointment must be a positive integer"),
    employeeName: z.string().min(1, "Employee name is required"),
    employeePhoneNumber: z.string().min(1, "Employee phone number is required"),
    employeeEmail: z.string().email("Invalid email format").min(1, "Employee email is required"),
  });

  // Schema for token validation
  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
  });

  // Response schema for success messages
  static success_response = z.object({
    message: z.string(),
  });

  // Response schema for an array of appointments
  static appointmentsResponseSchema = z.array(this.appointmentSchema);
}

export default AppointmentsSchemas;