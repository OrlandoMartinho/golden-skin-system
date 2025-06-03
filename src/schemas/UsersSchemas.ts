import { z } from 'zod';

class UserSchemas {
  // Authentication
  static Authenticate = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
  });

    static uploadFile = z.object({
    file:z.any().optional()
  }).nullable()

  static AuthenticateResponse = z.object({
    message: z.string(),
    accessToken: z.string(),
    userRole: z.number(),
    idUser:z.number()
  });

  static DeleteUser = z.object({
    idUser: z.number().optional(),  
  });

  static tokenSchema = z.object({
    token: z.string().min(1, "Token is required") 
  });

  // User View
// User View
static userSchema = z.object({
  idUser: z.number(),
  name: z.string(),
  password: z.string(),
  token: z.string(),
  email: z.string(),
  photo: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  role: z.number(),
  path: z.string().nullable(),
  status: z.boolean(),
  createdIn: z.date(), 
  updatedIn: z.date().nullable(), 
});

  // User ID
  static UsersId = z.object({
    idUser: z.number().int().positive("ID User must be a positive integer")
  });

  // Code Handling
  static ReceiveCodeInEmail = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required")
  });

  // Password Recovery
  static RecoverPassword = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    code: z.string().min(1, "Code is required"),
    newPassword: z.string().min(1, "New password is required")
  });

  // User Update
  static UsersUpdate = z.object({
    name: z.string().min(1, "Name is required"),
    status: z.boolean().optional(),
    phoneNumber: z.string().optional(),
  });

  static UserRegister = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    phoneNumber: z.string().optional(),
    code: z.string().optional(),
   });

  // Password Update
  static UpdatePassword = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required")
  });

  // Additional Records
  static RecoverPasswordWithCode = z.object({
    email: z.string().email(),
    code: z.string(),
    newPassword: z.string()
  });

  static ChangeEmail = z.object({
    newEmail: z.string().email(),
    code: z.string(),
    password: z.string()
  });

  static ChangeEmailResponse = z.object({
    message: z.string(),
    token: z.string(),
    type: z.string()
  });

  static PasswordEdit = z.object({
    newPassword: z.string(),
    oldPassword: z.string()
  });

  static ChangePasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
    role: z.string()
  });

  static ReceiveCode = z.object({
    email: z.string().email()
  });

  // Response Schemas
  static usersResponseSchema = z.array(this.userSchema);

  static uploadPhotoResponseSchema = z.object({
    url: z.string()
  });
}

export default UserSchemas;