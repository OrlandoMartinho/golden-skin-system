import { z } from "zod";

class ReplysSchemas {
  // Resposta para erros gerais
  static general_reply = z.object({
    
  });

  // Resposta para erros 400 - Requisição inválida
  static general_post_reply = z.object({
    
  });
  
  static tokenSchema = z.object({
    token :z.string({ required_error: "The token cannot be empty" }).min(6,"By default a token has more than 8 characters")
  }).optional()
  // Resposta para erros 403 - Acesso proibido
  static general_put_reply = z.object({
    
  });

  

  // Resposta para sucesso
  static general_delete_reply = z.object({
    
  });

 
}

export default ReplysSchemas;
