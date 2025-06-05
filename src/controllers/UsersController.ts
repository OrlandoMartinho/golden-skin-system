import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/PrismaClient';
import EmailService from '../services/EmailsServices';
import GenerateVerificationCode from '../utils/code_generations';
import TokenService from '../services/TokensServices';
import NotificationsController from './NotificationsController';
import userSchema from '../schemas/UsersSchemas';
import path, { resolve } from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';
import { FastifyRequest } from 'fastify';
import FileService from '../services/StorageServices';
import InvalidDataException from '../errors/InvalidDataException';
import AuthorizationException from '../errors/AuthorizationException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import ItemAlreadyExistsException from '../errors/ItemAlreadyExistsException';
import ForbiddenExceptionError from '../errors/ForbiddenExceptionError';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import ResponsesSchemas from '../schemas/ResponsesSchemas';

const saltRounds = 10;
const uploadsPath = path.resolve(__dirname, '../../storage/users');
// Configure environment
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
const secretKey = { secretKey: process.env.SECRET_KEY || 'default' };

class Users {
  private emailService: EmailService;
  private tokenService: TokenService = new TokenService();
  private notification: NotificationsController = new NotificationsController();
  private fileService: FileService = new FileService();
  private readonly responseSquema = ResponsesSchemas.success_response;

  constructor() {
    this.emailService = new EmailService();
    if (secretKey.secretKey === undefined) {
      throw new InternalServerErrorException('Secret key is not defined in the environment variables');
    }
  }

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

  public async updatePasswordWithCode(data: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.RecoverPassword, data);
    const { email, code, newPassword } = validatedData;

    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      if (user.role === 0) {
        throw new ForbiddenExceptionError('An administrator cannot recover the password');
      }

      const verificationCode = await prisma.verificationCodes.findFirst({
        where: {
          email,
          code,
          used: false,
        },
      });

      if (!verificationCode) {
        throw new ItemNotFoundException('Invalid or already used verification code');
      }

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.users.update({
        where: { idUser: user.idUser },
        data: { password: hashedPassword },
      });

      await prisma.verificationCodes.update({
        where: { id_verification_code: verificationCode.id_verification_code },
        data: { used: true },
      });

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof ForbiddenExceptionError ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to change password');
    }
  }

  public async changeEmail(data: any, key: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.ChangeEmail, data);
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { newEmail, code, password } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({
        where: { idUser: userId },
      });

      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthorizationException('Incorrect password');
      }

      const verificationCode = await prisma.verificationCodes.findFirst({
        where: { email: newEmail, code, used: false },
      });

      if (!verificationCode) {
        throw new ItemNotFoundException('Invalid or already used verification code');
      }

      const emailInUse = await prisma.users.findUnique({
        where: { email: newEmail },
      });

      if (emailInUse) {
        throw new ItemAlreadyExistsException('Email in use');
      }

      await prisma.users.update({
        where: { idUser: userId },
        data: { email: newEmail },
      });

      await prisma.verificationCodes.update({
        where: { id_verification_code: verificationCode.id_verification_code },
        data: { used: true },
      });

      if (secretKey.secretKey === undefined) {
        throw new InternalServerErrorException('Secret key is not defined in the environment variables');
      }

      const newAccessToken = jwt.sign(
        {
          idUser: userId,
          email: newEmail,
          role: user.role.toString(),
          password: user.password,
        },
        secretKey.secretKey
      );

      await prisma.users.update({
        where: { idUser: userId },
        data: { token: newAccessToken },
      });

      return { message: 'Email changed successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof ItemAlreadyExistsException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to change email');
    }
  }

  public async password_edit(data: any, key: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.UpdatePassword, data);
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { newPassword, oldPassword } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const user = await prisma.users.findUnique({
        where: { idUser: userId },
      });

      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new AuthorizationException('Incorrect password');
      }

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.users.update({
        where: { idUser: userId },
        data: { password: hashedPassword },
      });

      if (secretKey.secretKey === undefined) {
        throw new InternalServerErrorException('Secret key is not defined in the environment variables');
      }

      const newAccessToken = jwt.sign(
        {
          idUser: userId,
          email: user.email,
          role: user.role.toString(),
          password: hashedPassword,
        },
        secretKey.secretKey
      );

      await prisma.users.update({
        where: { idUser: userId },
        data: { token: newAccessToken },
      });

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to edit password');
    }
  }

  public async register(data: any): Promise<z.infer<typeof userSchema.AuthenticateResponse>> {
    const validatedData = await this.zodError(userSchema.UserRegister, data);
    const { name, email, password, code } = validatedData;

    try {
      const verificationRecord = await prisma.verificationCodes.findFirst({
        where: { code, email },
      });

      if (!verificationRecord) {
        throw new ItemNotFoundException('Invalid verification code');
      }

      if (verificationRecord.used) {
        throw new ItemAlreadyExistsException('Verification code already used');
      }

      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        throw new ItemAlreadyExistsException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          status: true,
          role: 5,
          password: hashedPassword,
          createdIn: new Date(),
        },
      });

      if (secretKey.secretKey === undefined) {
        throw new InternalServerErrorException('Secret key is not defined in the environment variables');
      }

      const token = jwt.sign(
        {
          idUser: newUser.idUser,
          email: newUser.email,
          role: newUser.role,
          access_level: newUser.role,
        },
        secretKey.secretKey,
        { expiresIn: '1h' }
      );

      await prisma.verificationCodes.update({
        where: { id_verification_code: verificationRecord.id_verification_code },
        data: { used: true },
      });

      const adminUser = await prisma.users.findFirst({ where: { role: 0 } });
      if (adminUser) {
        await this.notification.add('User management', 'A new user has just registered on the website', adminUser.idUser);
      }

      const path_name = Date.now() + '' + newUser.idUser;
      const newFolderPath = path.join(uploadsPath, path_name);
      fs.mkdirSync(newFolderPath, { recursive: true });

      await prisma.users.update({
        where: { idUser: newUser.idUser },
        data: { path: path_name, token },
      });

      return {
        message: 'User registered successfully',
        accessToken: token,
        userRole: newUser.role,
        idUser:newUser.idUser
      };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof ItemAlreadyExistsException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register user');
    }
  }

  public async update(data: any, key: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.UsersUpdate, data);
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const isTokenValid = await this.tokenService.checkTokenUser(token);
      const userRole = await this.tokenService.userRole(token);
      if (!isTokenValid || userRole !== 5) {
        throw new AuthorizationException('Not authorized');
      }

      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Invalid user ID');
      }

      const user = await prisma.users.findUnique({ where: { idUser: userId as number } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      const { name, phoneNumber, status } = validatedData;
      await prisma.users.update({
        where: { idUser: user.idUser },
        data: {
          name,
          updatedIn: new Date(),
          phoneNumber: phoneNumber || user.phoneNumber,
          status: status !== undefined ? status : user.status,
        },
      });

      return { message: 'User updated successfully' };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof ItemNotFoundException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update user');
    }
  }

  public async delete(data: any, key: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.DeleteUser, data);
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { token } = validatedKey;
   
    try {
      const userRole = await this.tokenService.userRole(token);
      const isTokenValid = await this.tokenService.checkTokenUser(token);
      if (!isTokenValid || userRole !== 0) {
        throw new AuthorizationException('Not authorized');
      }

      const idUser = validatedData?.idUser || (await this.tokenService.userId(token));
      if (!idUser) {
        throw new InvalidDataException('Invalid user ID');
      }

      const user = await prisma.users.findUnique({ where: { idUser: idUser as number } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      if(user.role == 0){
        throw new ForbiddenExceptionError("It is not allowed to delete the Administrator")
      }

      const userAdmin = await prisma.users.findFirst({where:{role:0}})

      if(!userAdmin){
        throw new ItemNotFoundException("Administrator not found, please contact a backend technician")
      }

      if (!validatedData?.idUser) {
        await this.notification.add('User management', 'A user deleted their account from the app', userAdmin.idUser);
      }

      await prisma.users.delete({ where: { idUser: idUser as number } });

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof ItemNotFoundException ||
        error instanceof ForbiddenExceptionError||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      
      throw new InternalServerErrorException('An error occurred when trying to delete user');
    }
  }

  public async viewA(key: any, req: FastifyRequest): Promise<z.infer<typeof userSchema.userSchema>> {
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { token } = validatedKey;

    try {
        
      if(token === "undefined"){
       
          throw new AuthorizationException('Invalid Token');

      }


      if (!await this.tokenService.checkTokenUser(token)) {
        throw new AuthorizationException('Not authorized');
      }

      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Invalid user ID');
      }

      const user = await prisma.users.findUnique({ where: { idUser: userId as number } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }

      if (user.path && user.photo) {
        user.photo = this.fileService.generateLink('/users/' + user.path, req, user.photo);
      }
    
      return userSchema.userSchema.parse(user);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof ItemNotFoundException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }

     
      throw new InternalServerErrorException('An error occurred when trying to retrieve user');
    }
  }

  public async viewAll(key: any): Promise<z.infer<typeof userSchema.usersResponseSchema>> {
    const validatedKey = await this.zodError(userSchema.tokenSchema, key);
    const { token } = validatedKey;

    try {
      const isTokenValid = await this.tokenService.checkTokenUser(token);
      const userRole = await this.tokenService.userRole(token);

      if (!isTokenValid || userRole !== 0) {
        throw new AuthorizationException('Not authorized');
      }

      const users = await prisma.users.findMany();

      return userSchema.usersResponseSchema.parse(users);
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve users');
    }
  }

  public async authenticate(data: any): Promise<z.infer<typeof userSchema.AuthenticateResponse>> {
    const validatedData = await this.zodError(userSchema.Authenticate, data);
    const { password, email } = validatedData;

    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) {
        throw new ItemNotFoundException('User not found');
      }
// 
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthorizationException('Incorrect password');
      }

      if (!secretKey.secretKey) {
        throw new InternalServerErrorException('Secret key is not defined in the environment variables');
      }

      const token = jwt.sign(
        { idUser: user.idUser, email: user.email, role: user.role },
        secretKey.secretKey,
        { expiresIn: '8h' }
      );

      await prisma.users.update({
        where: { idUser: user.idUser },
        data: { token },
      });

      return {
        message: 'User authenticated successfully',
        accessToken: token,
        userRole: user.role,
        idUser:user.idUser
      };
    } catch (error) {
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to authenticate');
    }
  }

  public async receive_code(dataCode: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.ReceiveCode, dataCode);
    const { email } = validatedData;

    try {
      const verificationCode = new GenerateVerificationCode().generate_code();

      await prisma.verificationCodes.create({
        data: { email, code: verificationCode, used: false },
      });

      const emailSent = await this.emailService.sendConfirmationCode(email, verificationCode);
      if (!emailSent) {
        throw new InternalServerErrorException('Error sending verification email');
      }

      return { message: 'Verification email sent successfully' };
    } catch (error) {
      if (error instanceof InvalidDataException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to send verification code');
    }
  }

  public async tokenValid(dataCode: any): Promise<z.infer<typeof this.responseSquema>> {
    const validatedData = await this.zodError(userSchema.tokenSchema, dataCode);
    const { token } = validatedData;

    try {
      if (!await this.tokenService.checkTokenUser(token)) {
        throw new AuthorizationException('Not authorized');
      }

      const idUser = await this.tokenService.userId(token);
      if (!idUser) {
        throw new InvalidDataException('Invalid user ID in token');
      }

      return { message: 'Verification token successfully' };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to validate token');
    }
  }

  private async validatePhotoFile(file: any): Promise<void> {
    const photoSchema = z.object({
      file: z.any().refine((val) => val !== undefined && val !== null, {
        message: "File is required",
      }),
      filename: z.string().min(1, "Filename is required"),
      toBuffer: z.function().returns(z.promise(z.instanceof(Buffer))),
    });

    await this.zodError(photoSchema, file);
  }

  public async uploadPhoto(data: any, file: any, req: FastifyRequest): Promise<z.infer<typeof userSchema.uploadPhotoResponseSchema>> {
    const validatedData = await this.zodError(userSchema.tokenSchema, data);
    await this.validatePhotoFile(file);
    const { token } = validatedData;

    try {
      if (!await this.tokenService.checkTokenUser(token)) {
        throw new AuthorizationException('Not authorized');
      }

      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new InvalidDataException('Invalid ID');
      }

      const fileBuffer = await file.toBuffer();
      const fileName = Date.now() + path.extname(file.filename);

      const pathh = 'users/' + (await this.fileService.getPath(userId));
      if (!pathh) {
        throw new InvalidDataException('Invalid folder. Please reset the database.');
      }

      await this.fileService.saveFile(fileBuffer, fileName, pathh);

      const fileUrl = fileName;
      await prisma.users.update({
        where: { idUser: userId },
        data: { photo: fileUrl },
      });

      const generatedUrl = this.fileService.generateLink(pathh, req, fileName);

      return {
        url: generatedUrl
      };
    } catch (error) {
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to upload photo');
    }
  }
}

export default Users;