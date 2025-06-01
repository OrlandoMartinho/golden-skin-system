import * as crypto from "crypto";
interface License  {
    license_number:string,
    license_expiration_date:Date,
    license_issuance_date :Date,
  }
export class LicenseGenerator {
    /**
     * Gera uma senha aleatória a partir do e-mail.
     * @param email - E-mail do usuário.
     * @returns Senha gerada.
     */
    public generatePassword(email: string): string {
        if (!email.includes('@')) {
            throw new Error('E-mail inválido');
        }

        // Remove o domínio do e-mail e embaralha os caracteres
        const namePart = email.split('@')[0];
        const shuffledName = namePart.split('').sort(() => Math.random() - 0.5);

        // Pegamos 4 letras aleatórias do e-mail
        const letters = shuffledName.slice(0, 4).join('');

        // Geramos 4 números aleatórios
        const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');

        // Misturamos letras e números e retornamos a senha
        const passwordArray = (letters + numbers).split('').sort(() => Math.random() - 0.5);

        return passwordArray.join('');
    }

    /**
     * Gera uma chave de licença no formato especificado.
     * @param email - E-mail do usuário.
     * @param dias - Tempo de expiração em dias (padrão: 3 anos).
     * @returns Chave de licença codificada.
     */


    public gerarLicenca(email: string, dias: number = 1095): License {
        const randomKey: string = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 caracteres aleatórios
    
        const dataHoje = new Date();
        const dataExpiracao = new Date(dataHoje);
        dataExpiracao.setDate(dataExpiracao.getDate() + dias);
    
        // Montar licença antes da codificação
        const licenca: string = `LK.${randomKey}-${Buffer.from(email).toString("base64url").toUpperCase()}-${dataExpiracao.toISOString().split("T")[0]}`;
    
        return {
            license_number: licenca,
            license_expiration_date: dataExpiracao,         // <- como Date
            license_issuance_date: dataHoje                 // <- como Date
        };
    }
    
}
