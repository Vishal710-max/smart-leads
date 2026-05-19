# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Live Demo

- **Frontend**: https://smart-leads.vercel.app
- **Backend API**: https://smart-leads-server.onrender.com

> ⚠️ Note: The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on the first request.

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- TailwindCSS
- React Router v6
- Axios

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (request validation)
- json2csv (CSV export)

### DevOps
- Docker + Docker Compose
- Render (backend hosting)
- Vercel (frontend hosting)
- MongoDB Atlas (cloud database)

---

## Features

- **JWT Authentication** — Register, login, protected routes
- **Role-Based Access Control** — Admin and Sales roles
- **Leads CRUD** — Create, read, update, delete leads
- **Advanced Filtering** — Filter by status, source, and free-text search (name or email)
- **Debounced Search** — 400ms debounce to reduce unnecessary API calls
- **Backend Pagination** — 10 records per page with full metadata
- **CSV Export** — Export currently filtered leads as a CSV file
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Loading Skeletons** — Skeleton rows while data is fetching
- **Empty States** — Friendly empty state when no results are found
- **Toast Notifications** — Success and error feedback on every action

---

## Project Structure

```
smart-leads/
├── client/                    # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── api/               # Axios instance + API call functions
│   │   ├── components/
│   │   │   ├── leads/         # LeadsTable, LeadForm, LeadFilters, Pagination, StatsBar
│   │   │   └── ui/            # Button, Input, Select, Modal, Badge, Toast, Skeleton
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useDebounce, useLeads
│   │   ├── pages/             # LoginPage, RegisterPage, DashboardPage
│   │   └── types/             # TypeScript interfaces and enums
│   ├── .env.example
│   └── package.json
│
├── server/                    # Node + Express + TypeScript backend
│   ├── src/
│   │   ├── config/            # DB connection, env config
│   │   ├── controllers/       # authController, leadController
│   │   ├── middlewares/       # auth, role, validation, error handler
│   │   ├── models/            # User, Lead (Mongoose schemas)
│   │   ├── routes/            # authRoutes, leadRoutes
│   │   ├── types/             # TypeScript interfaces, enums, Express extensions
│   │   └── utils/             # ApiError class, asyncWrapper
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── README.md
└── API_DOCS.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose *(optional)*
- MongoDB Atlas account **or** local MongoDB

---

### Option A — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/smart-leads.git
cd smart-leads

# 2. Copy and fill in environment variables
cp .env.example server/.env
# Edit server/.env with your values

# 3. Start all services
docker-compose up --build
```

Visit **http://localhost:3000**

---

### Option B — Manual Setup

**Backend**

```bash
cd server
cp ../.env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET

npm install
npm run dev
# Server runs on http://localhost:5000
```

**Frontend** (in a new terminal)

```bash
cd client
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
# App runs on http://localhost:3000
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_long_random_secret` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `NODE_ENV` | Environment | `development` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

See `.env.example` in the root for a template.

---

## Test Accounts

Register your own accounts at `/register`.

To test admin features (deleting leads), register with role **Admin**.
To test sales restrictions, register with role **Sales User**.

---

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for the full endpoint reference.

---

## Git Commit Conventions

This project uses conventional commits:

| Prefix | Purpose |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Config / tooling / setup |
| `docs:` | Documentation |
| `refactor:` | Code restructure without behavior change |

---

## Evaluation Checklist

- ✅ TypeScript throughout — no plain JavaScript files
- ✅ Proper interfaces and enums defined in `/types`
- ✅ No hardcoded URLs — all via environment variables
- ✅ Centralized error handling with `ApiError` class
- ✅ Request validation on all POST/PATCH routes
- ✅ Backend pagination with `skip` and `limit`
- ✅ Debounced search (400ms)
- ✅ Multiple filters working simultaneously
- ✅ Role-based access (delete is admin-only)
- ✅ Loading states, empty states, error toasts
- ✅ Docker Compose setup
- ✅ Dark mode support
- ✅ CSV export of filtered results
- ✅ Clean folder structure, reusable components

---

## Author

Vishal Bhingarde
[bhingardevishal5@gmail.com](mailto:bhingardevishal5@gmail.com)
[GitHub](https://github.com/Vishal710-max)
