# Full Stack Job Portal (Jobs24x Architecture)

A production-ready, high-performance Full Stack Job Portal built with React, TypeScript, Tailwind CSS, Zustand, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## 🏗 Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (Persistent Auth Store)
- **Routing**: React Router DOM (Role-based Protected Routes)
- **HTTP Client**: Axios with automatic JWT bearer interception
- **Forms & Validation**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js + TypeScript
- **Server Framework**: Express.js
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (Access Token + Refresh Token flow) + bcrypt password hashing
- **Security**: Helmet, CORS, Express Rate Limiter, strict Zod request validation
- **File Uploads**: Multer with 5MB limit and MIME-type validation (PDF, DOC, DOCX)

---

## 📁 Directory Structure

```
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components & Navbar
│   │   ├── pages/            # Auth pages (Login, Register, Forgot/Reset Password)
│   │   ├── layouts/          # RootLayout, AuthGuard
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── services/         # API service layer (auth.service)
│   │   ├── store/            # Zustand stores (authStore)
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── utils/            # Helper utilities
│   │   ├── routes/           # React Router route definitions
│   │   └── assets/           # Static media assets
│
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Core database models & relations
│   │   └── seed.ts           # Idempotent DB seeding script
│   ├── src/
│   │   ├── config/           # Environment variables & constants
│   │   ├── controllers/      # Thin Express request controllers
│   │   ├── services/         # Business logic layer
│   │   ├── routes/           # Express API routers
│   │   ├── middleware/       # Auth, error, upload, rate-limiter middleware
│   │   ├── validators/       # Zod schemas for all request payloads
│   │   ├── types/            # Express & JWT type declarations
│   │   └── app.ts            # Main application bootstrap
│   └── test-phase1.ts        # Automated Phase 1 verification test suite
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **PostgreSQL**: Running on port `5432` (locally or via Docker)

### 2. Database Setup
Ensure PostgreSQL is running on `localhost:5432`. If using Docker:
```bash
docker start smart-csd-db
# or run a standard postgres:15 container on 5432
```

### 3. Backend Setup
```bash
cd Backend
npm install
```
Configure `Backend/.env` (see `.env.example`):
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobportal?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-token-key-change-in-prod"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-in-prod"
FRONTEND_URL="http://localhost:5173"
```

Sync database schema and generate Prisma client:
```bash
npx prisma db push
```

Seed initial accounts and sample data:
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
```

Run test verification suite:
```bash
npm test
# Or run direct automated test suite:
npx ts-node test-phase1.ts
```

### 4. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🔐 Development Credentials (from Seed)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@jobportal.local` | `admin123` |
| **Recruiter** | `alice@techinnovations.example.com` | `recruiter123` |
| **Candidate** | `bob@example.com` | `candidate123` |

---

## 📡 Phase 1 Authentication API Endpoints

- `POST /api/auth/register` — Register Candidate
- `POST /api/auth/register-recruiter` — Register Recruiter with Company
- `POST /api/auth/login` — Login (All roles)
- `POST /api/auth/logout` — Revoke refresh token & logout
- `POST /api/auth/refresh` — Issue new access & refresh token
- `POST /api/auth/forgot-password` — Generate password reset token
- `POST /api/auth/reset-password` — Set new password using token
- `POST /api/auth/verify-email` — Verify email token
- `GET /api/auth/me` — Get authenticated user details (Protected)
- `GET /health` — API health check

---

## ✅ Phase 1 Verification Summary

All 17 Phase 1 automated integration tests passed:
1. Health check returns 200
2. Invalid candidate registration returns 400 `VALIDATION_ERROR`
3. Candidate registration succeeds (201, Role `CANDIDATE`)
4. Duplicate registration returns 409 `CONFLICT_ERROR`
5. Wrong password returns 401 `UNAUTHORIZED_ERROR`
6. Candidate login succeeds (200, returns user & tokens)
7. Recruiter registration succeeds (201, Role `RECRUITER`)
8. Admin login with seeded credentials succeeds (200, Role `ADMIN`)
9. Accessing protected `/auth/me` without token returns 401 `UNAUTHORIZED`
10. Accessing protected `/auth/me` with valid Bearer token returns 200 + user profile
11. Token refresh flow returns new access & refresh tokens
12. Forgot password returns reset token
13. Reset password succeeds (200)
14. Login with newly reset password succeeds (200)
15. Logout invalidates session (200)
16. Candidate cannot access recruiter endpoints (returns 403 `FORBIDDEN`)
17. Recruiter cannot access candidate endpoints (returns 403 `FORBIDDEN`)
