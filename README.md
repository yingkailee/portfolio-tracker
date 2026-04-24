# Portfolio Tracker

## Setup

```bash
cd backend/portfolio-tracker-backend && ./mvnw spring-boot:run
cd ../../frontend && npm install && npm run dev
```

## Features

- Create portfolios with custom fund allocations
- Calculate net worth projections with historical CAGR data
- Guest mode: use locally without login, login to save to database
- Real-time fund performance from Yahoo Finance
- Multiple portfolios supported

## Tech Stack

- Frontend: TypeScript + React (Vercel)
- Backend: Java + Spring Boot (Render)
- Database: PostgreSQL (Supabase)
