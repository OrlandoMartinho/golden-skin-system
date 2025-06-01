# Linka - Backend

Este é o backend da plataforma Linka, desenvolvido com Fastify e documentado com Swagger.

## Requisitos

- Node.js (versão recomendada: 18+)
- pnpm (caso não tenha, instale com `npm install -g pnpm`)
- Banco de dados configurado

## Instalação

1. Clone o repositório e acesse a branch `backend-feature`:
   ```sh
   git clone https://github.com/OrlandoMartinho/Linka.git
   cd Linka
   git checkout backend-feature
   ```

2. Instale as dependências com pnpm:
   ```sh
   pnpm install
   ```

3. Configure as variáveis de ambiente criando um arquivo `.env` com os valores necessários (veja um exemplo em `.env.example`).

## Executando o Servidor

Para iniciar o servidor, use o comando:
   ```sh
   pnpm dev
   ```
O servidor rodará em `http://localhost:3000`.

## Documentação da API

A documentação interativa do Swagger está disponível em:
   ```
   http://localhost:3000/docs/
   ```

## Estrutura do Projeto

```
LINKA_BACK_END/
├── config/           # Configurações gerais do sistema
├── controllers/      # Controladores das requisições
├── routes/           # Definição das rotas da API
├── schemas/          # Validações com Zod
├── services/         # Serviços de backend
├── types/            # Tipagens do projeto
├── utils/            # Funções auxiliares
├── uploads/          # Pasta para armazenar imagens
├── server.ts         # Arquivo principal do servidor
└── package.json      # Dependências e scripts do projeto
```

## Principais Tecnologias

- **Fastify** - Framework Node.js para APIs rápidas
- **Zod** - Validação de dados
- **Swagger** - Documentação interativa da API
- **Prisma** - ORM para banco de dados
- **TypeScript** - Tipagem estática para JavaScript

## Contribuição

1. Crie um fork do repositório.
2. Crie uma branch para suas mudanças (`git checkout -b minha-feature`).
3. Commit suas mudanças (`git commit -m 'Minha nova feature'`).
4. Envie para o repositório (`git push origin minha-feature`).
5. Abra um Pull Request na branch `backend-feature`.

## Contato

Caso tenha dúvidas ou sugestões, entre em contato!

---
**Equipe Linka** 🚀