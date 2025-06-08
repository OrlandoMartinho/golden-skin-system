import { prisma } from './PrismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { Client as PostgreSQLClient } from 'pg';

// Carregar variáveis de ambiente
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });

// Verificação das variáveis obrigatórias
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_PORT',
  'DATABASE_URL',
  'SECRET_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_NAME',
  'ADMIN_PHONE_NUMBER',
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
}

// Caminho dos uploads
const uploadsPath = path.resolve(__dirname, '../../storage');

// Configurações do banco de dados
const databaseConfig = {
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  name: process.env.DATABASE_NAME!,
  port: Number(process.env.DATABASE_PORT!),
  url: process.env.DATABASE_URL!,
};

// Segurança
const securityConfig = {
  secretKey: process.env.SECRET_KEY!,
  saltRounds: 10,
};

// Configurações do Admin
const adminConfig = {
  email: process.env.ADMIN_EMAIL!,
  password: process.env.ADMIN_PASSWORD!,
  name: process.env.ADMIN_NAME!,
  phone: process.env.ADMIN_PHONE_NUMBER!,
};

class DatabaseService {
  async initializeAdmin() {
    try {
      const salt = bcrypt.genSaltSync(securityConfig.saltRounds);
      const encryptedPassword = bcrypt.hashSync(adminConfig.password, salt);

      const existingAdmin = await prisma.users.findUnique({
        where: { email: adminConfig.email },
      });

      if (!existingAdmin) {
        const newUser = await prisma.users.create({
          data: {
            email: adminConfig.email,
            password: encryptedPassword,
            name: adminConfig.name,
            role: 0,
            status: true,
            phoneNumber: adminConfig.phone,
            token: null,
          },
        });

        const accessToken = jwt.sign(
          {
            idUser: newUser.idUser,
            email: adminConfig.email,
            role: 0,
          },
          securityConfig.secretKey
        );

        const path_name = Date.now() + '' + newUser.idUser;
        const newFolderPath = path.join(uploadsPath, path_name);
        fs.mkdirSync(newFolderPath, { recursive: true });

        await prisma.users.update({
          where: { idUser: newUser.idUser },
          data: { token: accessToken, path: path_name },
        });

        console.log(`Admin user ${adminConfig.name} created successfully.`);
      } else {
        console.log(`Admin user ${adminConfig.name} already exists.`);
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
      throw error;
    }
  }

  async verifyDatabase() {
    try {
      if (databaseConfig.url.startsWith('mysql')) {
        await this.verifyMySQLDatabase();
      } else if (databaseConfig.url.startsWith('postgresql')) {
        await this.verifyPostgresDatabase();
      } else {
        console.warn('Unsupported or skipped DB type.');
      }
    } catch (error) {
      console.error('Database verification error:', error);
      throw error;
    }
  }

  private async verifyMySQLDatabase() {
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      user: databaseConfig.user,
      password: databaseConfig.password,
      port: databaseConfig.port,
    });

    try {
      const [databases] = await connection.query(
        `SHOW DATABASES LIKE '${databaseConfig.name}'`
      );

      if (Array.isArray(databases) && databases.length === 0) {
        console.log(`Creating database "${databaseConfig.name}"...`);
        await connection.query(`CREATE DATABASE ${databaseConfig.name}`);
      } else {
        console.log(`Database "${databaseConfig.name}" already exists.`);
      }

      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } finally {
      await connection.end();
    }
  }

  private async verifyPostgresDatabase() {
    const client = new PostgreSQLClient({
      host: databaseConfig.host,
      user: databaseConfig.user,
      password: String(databaseConfig.password), // Evita erro se for undefined ou não string
      port: databaseConfig.port,
      database: 'postgres', // Conecta ao banco padrão para criar outro
    });

    try {
      await client.connect();

      const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = '${databaseConfig.name}'`
      );

      if (res.rowCount === 0) {
        console.log(`Creating database "${databaseConfig.name}"...`);
        await client.query(`CREATE DATABASE ${databaseConfig.name}`);
        execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
      } else {
        console.log(`Database "${databaseConfig.name}" already exists.`);
      }

     

    } finally {
      await client.end();
    }
  }

  async initialize() {
    try {
      await this.verifyDatabase();
      await this.initializeAdmin();
    } catch (error) {
      console.error('Database initialization failed:', error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
      console.log('Database service initialized');
    }
  }
}

const databaseService = new DatabaseService();
export default databaseService;
