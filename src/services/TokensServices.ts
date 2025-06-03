// src/services/TokenService.ts

import jwt, { JwtPayload } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client'; // Importa o PrismaClient
import  tokenSchema from '../schemas/TokensServicesSchemas'; // Importa os esquemas de validação
import DateFormatter from '../utils/date_formatter';


interface DecodedToken extends JwtPayload {
    idUser: number;
    photo: string;
    password: string;
    email: string;
    role: number; // Agora é um número, pois `role` é um `Int`
    access_level?: string;
}

class TokenService {
    private secretKey: string;
    private db: PrismaClient; // Define o tipo do db como PrismaClient

    constructor() {
        this.secretKey = process.env.SECRET_KEY || 'defaut'; // Obtém a chave secreta do ambiente
        this.db = new PrismaClient(); // Inicializa o PrismaClient
    }

    private async decodeToken(accessToken: string): Promise<DecodedToken | null> {
        try {
            
            return jwt.verify(accessToken, this.secretKey) as DecodedToken;
        } catch (err) {
         
            return null;
        }
    }

    public async getUserProperty<T extends keyof DecodedToken>(
        accessToken: string,
        property: T
    ): Promise<DecodedToken[T] | -1> {
        const decodedToken = await this.decodeToken(accessToken);
        if (decodedToken === null) {
            return null;
        }

        // Certifique-se de que a propriedade retornada não é `undefined`
        const result = decodedToken[property];
        return result !== undefined ? result : -1;
    }

    public userId(accessToken: string): Promise<number | null> {
        return this.getUserProperty(accessToken, 'idUser') as Promise<number | null>;
    }

    public userRole(accessToken: string): Promise<number | null> { // Agora retorna número
        return this.getUserProperty(accessToken, 'role') as Promise<number | null>;
    }

    public userAccessLevel(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'access_level') as Promise<string | null>;
    }

    public userPhoto(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'photo') as Promise<string | null>;
    }

    public userPassword(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'password') as Promise<string | null>;
    }

    public userEmail(accessToken: string): Promise<string | null> {
        return this.getUserProperty(accessToken, 'email') as Promise<string | null>;
    }

    public async checkTokenUser(accessToken: string): Promise<boolean> {
        try {
           
            const decoded = await this.decodeToken(accessToken);
          
            if (decoded === null) {
                return false;
            }
            const user = await this.db.users.findUnique({
                where: { idUser: decoded.idUser }, // Usa idUser do token
                select: { idUser: true },   // Verifica a existência do idUser
            });
            return user !== null; // Retorna verdadeiro se o usuário existir
        } catch (err) {
          
            return false;
        }
    }


    public async checkDate(date: string): Promise<boolean> {
        try {
         
            const dateNow = new DateFormatter().getFormattedDate();
            const expiresDate = new DateFormatter().formatDate(date);

            const inputDate = new Date(expiresDate);
            const currentDate = new Date(dateNow);

            return inputDate >= currentDate; // Retorna true se a data não estiver expirada
        } catch (err) {
            
            return false;
        }
    }
}

export default TokenService;
