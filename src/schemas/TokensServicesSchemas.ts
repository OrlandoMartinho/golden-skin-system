import { z } from "zod";

class TokenSchemas {

    // Schema para leitura de notificações
    static tokenSchema = z.object({
      token :z.string().optional()
    });

    static tokenSchemaValidate = z.object({
      token :z.string({ required_error: "The token cannot be empty" }).min(6,"By default a token has more than 8 characters").optional()
    })

   

}

export default TokenSchemas.tokenSchema;
