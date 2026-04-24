# Portfolio Tracker

## Setup

```bash
cd frontend && npm install
cd backend/portfolio-tracker-backend && ./mvnw spring-boot:run
```

## Features

- Create portfolios with custom fund allocations
- Calculate net worth projections with historical CAGR data
- Guest mode: use locally without login, login to save to database
- Real-time fund performance from Yahoo Finance
- Multiple portfolios supported

## Tech Stack

- Frontend: React + TypeScript + Vite (Vercel)
- Backend: Spring Boot (Java) (Render)
- Database: PostgreSQL (Supabase)