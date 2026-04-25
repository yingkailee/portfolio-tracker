# Portfolio Tracker

## Quick Start with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Uses H2 in-memory database (no setup required)

## Local Development

**Backend:**
```bash
cd backend/portfolio-tracker-backend && ./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend && npm install && npm run dev
```

## Features

- Create portfolios with custom fund allocations
- Calculate net worth projections with historical CAGR data
- Guest mode: use locally without login, login to save to database
- Historical fund performance from Yahoo Finance
- Multiple portfolios supported

## Tech Stack (Deployment)

- Frontend: TypeScript + React (Vercel)
- Backend: Java + Spring Boot (Render)
- Database: PostgreSQL (Supabase)