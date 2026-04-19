# Portfolio Tracker

## Setup

```bash
cd frontend && npm install
```

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
- Guest mode: use locally without login, login to save to database

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot (Java)
- Database: H2