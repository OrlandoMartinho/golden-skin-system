import { z } from "zod";

class ResponsesSchemas {
  // Resposta para erros gerais
  static general_error_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().optional(), 
    errors: z.array(z.string()).optional(),
  });

  // Resposta para erros 400 - Requisição inválida
  static error_400_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().min(1, { message: "At least one error description is required" }).optional(),
    errors: z.array(z.string()).min(1, { message: "At least one error description is required" }).optional(),
  });
  

  // Resposta para erros 403 - Acesso proibido
  static error_403_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().optional(),
  });

  // Resposta para sucesso
  static success_response = z.object({
    message:z.string()
  })
  // Resposta para erro 401 - Não autorizado
  static error_401_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().optional(),
  });

  // Resposta para erro 404 - Não encontrado
  static error_404_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().optional(),
  });

  // Resposta para erro 500 - Erro interno do servidor
  static error_500_response = z.object({
    message: z.string().min(1, { message: "The message field cannot be empty" }),
    error: z.string().optional(),
  });
}

export default ResponsesSchemas;
