# 🛡️ NestJS Auth + User CRUD API

A simple, modular REST API built with [NestJS](https://nestjs.com) that provides:

* 🔐 Authentication (JWT-based)
* 👤 User registration and login
* ⚙️ CRUD operations on users (Create, Read, Update, Delete)
* 🧪 Swagger API documentation

---

## 📁 Project Structure

```
src/
│
├── auth/               # Auth module (login, signup)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
│
├── user/               # User CRUD module
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── user-res.dto.ts
│
├── common/             # Shared utilities (guards, decorators, etc.)
├── app.module.ts
└── main.ts
```

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* PostgreSQL (or any DB you configure)
* Docker (optional, for containerization)

---

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/nestjs-auth-crud.git
cd nestjs-auth-crud

# Install dependencies
npm install
```

---

### ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/nest_crud
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

---

### 🔧 Database Setup (PostgreSQL Example)

Make sure your database is running. Then:

```bash
# Run Prisma or TypeORM migrations if applicable
# or just sync schema from entities:
npm run start:dev
```

---

### 🏁 Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

### 📖 API Documentation

Swagger is available at:

```
http://localhost:3000/api
```

---

## 🔐 Auth Endpoints

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| POST   | `/auth/signup` | Register a new user | ❌             |
| POST   | `/auth/login`  | Login and get token | ❌             |

---

## 👤 User CRUD Endpoints

| Method | Endpoint     | Description       | Auth Required |
| ------ | ------------ | ----------------- | ------------- |
| GET    | `/users`     | Get all users     | ✅             |
| GET    | `/users/:id` | Get user by ID    | ✅             |
| PATCH  | `/users/:id` | Update user by ID | ✅             |
| DELETE | `/users/:id` | Delete user by ID | ✅             |

🔐 All protected routes require a `Bearer` token in the `Authorization` header.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 🐳 Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

Ensure your `.env` values match your Docker setup.

---

## 🛠 Tech Stack

* [NestJS](https://nestjs.com)
* [TypeORM / Prisma](https://typeorm.io) (depending on your choice)
* [JWT](https://jwt.io)
* [Swagger](https://swagger.io)
* [PostgreSQL](https://www.postgresql.org/)

---

## 📌 Future Improvements

* Role-based access control (RBAC)
* Password reset via email
* Refresh token support
* Rate limiting / throttling

---

## 🧑‍💻 Author

**Your Name** – [your-website.com](https://your-website.com)

---

## 📄 License

This project is licensed under the MIT License.

---

Let me know if you'd like this turned into an actual `README.md` file or if you're using **Prisma**, **TypeORM**, or **MongoDB** so I can tailor the instructions to your stack.
