# Bonded - Group Finder

A collaborative group-finding platform that connects developers, designers, and creators based on work style and shared values. 

## Quick Start

To run the full-stack application locally, start both the backend API and the frontend client.

### 1. Start the Backend

```bash
cd backend
npm install
# Ensure your local MongoDB and Redis instances are running (see Configuration)
npm run dev
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

Based on the core system architecture, Bonded offers:

- **Authentication & Security**: Robust JWT-based authentication system featuring Email Verification flows, secure Password Resets, and protected routing.
- **Team & Group Management**: Create teams, post announcements, seamlessly track membership history, and explore detailed group pages.
- **Application Processing**: Transparent pipeline allowing users to request to join teams, empowering leaders to review, accept, or reject members.
- **Dynamic Profiles & Ecosystem**: Dedicated user profiles, dashboard activity tracking, and comprehensive history logging (`user_history`, `team_history`).
- **Premium Fluid Frontend**: Organic, cliché-free UI powered by deeply integrated GSAP ScrollTriggers, Tailwind CSS v4, and React Hooks.

## Configuration

Create a `.env` file in the `backend/` directory to configure the environment:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/bonded` |
| `REDIS_URL` | Redis connection URL for session/cache (`ioredis`) | `redis://127.0.0.1:6379` |
| `JWT_SECRET` | Secret key for JWT authentication generation | `your_secret_key` |

Create a `.env` file in the `frontend/` directory:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Endpoint URL for connecting mapping Axios to API | `http://localhost:5000/api` |

## API Reference

The backend exposes several modular REST resources mounted via Express routers:

- `/api/auth` - Login, Signup, Verification, Reset
- `/api/team` - Team creation and base retrieval
- `/api/team_member` - Roster and membership validations
- `/api/application` - Applying to teams and leader reviews
- `/api/note` & `/api/announcement` - Internal team communication
- `/api/user_history` & `/api/team_history` - Audit tracking

