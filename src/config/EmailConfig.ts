import nodemailer, { Transporter } from 'nodemailer';
import { config } from 'dotenv';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
interface EmailCredentials {
  email: string;
  password: string;
  service:string;
} 

class EmailConfig {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service:process.env.EMAIL_SERVICE || 'gmail', // Default to Gmail if not specified
      host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Default SMTP host
      auth: {
        user:process.env.EMAIL ,
        pass:process.env.EMAIL_PASSWORD  
      },
      tls: {
        rejectUnauthorized: false 
      }
    });
  }

  public getTransporter(): Transporter {
    return this.transporter;
  }
}

const emailConfig = new EmailConfig();

export default emailConfig.getTransporter();
