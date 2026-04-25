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