# Portfolio Tracker

**Early Development** - Not production ready.

## Setup

```bash
# Frontend dependencies
cd frontend && npm install
```

## Admin Access

Default credentials (created on first run):
- **Username:** `su`
- **Password:** `gw`

Login via the web interface at http://localhost:5173

## Running

**Backend:**
```bash
cd backend/portfolio-tracker-backend
./mvnw spring-boot:run
```
Runs on http://localhost:8080

**Frontend:**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173

## Features

- Create portfolios with custom fund allocations
- Add/remove funds (VOO, VTI, BND, etc.)
- Calculate net worth projections
- Multiple portfolios supported

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot (Java)
- Database: H2

## Security

- HTTP Basic Authentication with STATELESS sessions
- Passwords stored using BCryptPasswordEncoder
- Only-authenticated API requests allowed for /api/**