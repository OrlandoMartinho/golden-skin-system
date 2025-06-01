import { prisma } from './PrismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path, { resolve } from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { Client as PostgreSQLClient } from 'pg';


// Configure environment
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

// Verifica se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_PORT',
  'DATABASE_URL',
  'SQLITE_URL',
  'MONGO_URL',
  'SECRET_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_NAME',
  'ADMIN_PHONE_NUMBER'
];



// Storage setup
const uploadsPath = path.resolve(__dirname, '../../storage');

// Database configuration
const databaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  name: process.env.DATABASE_NAME || 'golden_skin_system_bd',
  port: Number(process.env.DATABASE_PORT || 3306), // Default MySQL port
  url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/golden_skin_system_bd', // Default MySQL URL
sqliteUrl: process.env.SQLITE_URL || 'file:./mydatabase.sqlite', // Default SQLite URL
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase', // Default MongoDB URL
};

// Security configuration
const securityConfig = {
  secretKey: process.env.SECRET_KEY,
  saltRounds: 10
};

// Admin configuration
const adminConfig = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  name: process.env.ADMIN_NAME,
  phone: process.env.ADMIN_PHONE_NUMBER 
};

class DatabaseService {
  async initializeAdmin() {
    if (!adminConfig.email || !adminConfig.password || !adminConfig.name || !adminConfig.phone) {
      throw new Error('Admin configuration is incomplete. Please check your environment variables.');
    }

    if (!securityConfig.secretKey) {
      throw new Error('Security configuration is incomplete. Please check your environment variables.');
    }
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
            role: 0, // 0 for admin
            status: true,
            phoneNumber: adminConfig.phone,
            token: null,
          },
        });

        const accessToken = jwt.sign(
          {
            idUser: newUser.idUser,
            email: adminConfig.email,
            role: 0, // admin
          },
          securityConfig.secretKey
        );

        await prisma.users.update({
          where: { idUser: newUser.idUser },
          data: { token: accessToken }
        });

        // Create storage folder for admin
        const adminFolder = path.join(uploadsPath, `admin_${newUser.idUser}`);
        fs.mkdirSync(adminFolder, { recursive: true });
        
        console.log(`Admin user ${adminConfig.name} created successfully.`);
      } else {
        console.log(`Admin user ${adminConfig.name} updated successfully.`);
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
      throw error;
    }
  }

  async verifyDatabase() {

    if(!databaseConfig.url) {
        throw new Error('Database configuration is incomplete. Please check your environment variables.');
      }
    try {
      if (databaseConfig.url.startsWith('mysql')) {
        await this.verifyMySQLDatabase();
      } else if (databaseConfig.url.startsWith('postgresql')) {
        await this.verifyPostgresDatabase();
      } else if (databaseConfig.url.startsWith('sqlite')) {
        console.log('SQLite database requires no manual setup.');
      } else if (databaseConfig.url.startsWith('mongodb')) {
        console.log('MongoDB database requires no manual setup.');
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
        console.log(`Database "${databaseConfig.name}" created successfully.`);
        execSync('npx prisma migrate dev --name init\n', { stdio: 'inherit' });

      } else {
        console.log(`Database "${databaseConfig.name}" already exists.`);
      }

      // Run migrations
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      } catch (migrationError) {
        console.error('Migration error:', migrationError);
      }
    } finally {
      await connection.end();
    }
  }

  private async verifyPostgresDatabase() {
    const client = new PostgreSQLClient({
      host: databaseConfig.host,
      user: databaseConfig.user,
      password: databaseConfig.password,
      port: databaseConfig.port,
    });

    try {
      await client.connect();
      const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = '${databaseConfig.name}'`
      );

      if (res.rowCount === 0) {
        console.log(`Creating database "${databaseConfig.name}"...`);
        await client.query(`CREATE DATABASE ${databaseConfig.name}`);
        console.log(`Database "${databaseConfig.name}" created successfully.`);
      } else {
        console.log(`Database "${databaseConfig.name}" already exists.`);
      }

      // Run migrations
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      } catch (migrationError) {
        console.error('Migration error:', migrationError);
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