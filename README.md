
# 🟫 Golden Skin System - Backend

This is the backend for the **Golden Skin System**, developed with [**Fastify**](https://www.fastify.io/), [**TypeScript**](https://www.typescriptlang.org/), and documented with Swagger. It supports MySQL database, automatic admin configuration, and email services.

## ✅ Requirements

* Node.js (recommended: 18+)
* pnpm (`npm install -g pnpm`)
* Active MySQL database

## ⚙️ Installation

1. Clone the repository and navigate to the project:

   ```bash
   git clone https://github.com/OrlandoMartinho/golden-skin-system.git
   cd golden-skin-system
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the project root and fill it with the following example data.

## 🔐 `.env` File (example)

```env
# Database (MySQL)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=golden_skin_system_bd
DATABASE_PORT=3306
DATABASE_URL="mysql://root:@localhost:3306/golden_skin_system_bd"

# Email and Email Service
EMAIL=
EMAIL_PASSWORD=
EMAIL_SERVICE=

# Server
SERVER_HOST=localhost
SERVER_PORT=3000

# Alternative Databases (optional)
SQLITE_URL=
MONGO_URL=

# Admin User (auto-created)
ADMIN_EMAIL=servicospeledouro@gmail.com
ADMIN_PASSWORD=12345678
ADMIN_NAME="Pele douro"
ADMIN_PHONE_NUMBER=123456789

# Security
SECRET_KEY=DJMFAJHFUJITREO8TJHUVJNIGTOLPAJ64YSHF

# Storage Service
STORAGE_BASE_URL=
STORAGE_BASE_PROTOCOL=
```

## 🚀 Running the Project

After configuring the `.env` file, run:

```bash
pnpm dev
```

The server will be available at:
👉 `http://localhost:3000`

## 📘 API Documentation

Interactive Swagger documentation:
👉 `http://localhost:3000/docs`

## 🗂️ Project Structure

```
golden-skin-system/
├── assets/           # Static files (optional)
├── node_modules/
├── prisma/           # Prisma migrations and schema
├── src/
│   ├── config/       # General configurations
│   ├── controllers/  # Route logic
│   ├── errors/       # Error handling
│   ├── routes/       # Fastify routes
│   ├── schemas/      # Zod validations
│   ├── services/     # Services (email, auth, etc.)
│   ├── types/        # TypeScript typings
│   ├── utils/        # Helper functions
│   └── server.ts     # Server initialization
├── storage/          # Local uploads and files
├── .env              # Environment variables
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

## 🛠️ Technologies Used

* **Fastify** – Fast and lightweight Node.js framework
* **TypeScript** – Static typing for development
* **Zod** – Data validation
* **Prisma** – ORM for relational databases
* **Swagger** – Automatic API documentation

## 🤝 Contribution

1. Fork the project
2. Create your branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m 'feat: my new feature'`
4. Push to your branch: `git push origin my-feature`
5. Open a Pull Request

---

**Golden Skin System** – Developed with 💛 by Orlando Martinho

