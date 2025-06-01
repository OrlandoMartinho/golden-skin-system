declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      EMAIL: string;
      PASSWORD_EMAIL: string;
      SERVICE_EMAIL: string;
      SERVER_HOST: string;
      SERVER_PORT: string;
      DEBUG_MODE?: 'true' | 'false';
    }
  }
  