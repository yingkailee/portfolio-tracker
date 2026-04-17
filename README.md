# Portfolio Tracker

**Early Development** - Not production ready.

## Running Locally

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

- Create and manage stock portfolios with custom allocations
- Choose from available funds (VOO, VTI, BND, VNQ, QQQ, VEA)
- Add/remove funds dynamically
- Calculate net worth projections over time
- Yield calculated from portfolio allocations
- Multiple portfolios per user
- Searchable dropdown for portfolio selection

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot (Java)
- Database: H2 (in-memory)