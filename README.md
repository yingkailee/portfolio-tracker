# Portfolio Tracker

## Quick Start with Docker

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Run:
```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Uses H2 in-memory database (no setup required)

## Local Development (without Docker)

1. **Supabase (default):** Add a `.env` file in `backend/portfolio-tracker-backend/` with your database credentials, then:
   ```bash
   cd backend/portfolio-tracker-backend && ./mvnw spring-boot:run
   ```

2. **H2 in-memory (no setup needed):**
   ```bash
   cd backend/portfolio-tracker-backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
   ```
   H2 console available at `/h2-console` when using this profile.

Start the frontend separately:
```bash
cd frontend && npm run dev
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