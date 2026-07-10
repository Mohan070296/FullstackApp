# Food Delivery App

A Zomato-like full-stack food delivery platform built with React, Spring Boot, and MySQL.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Redux Toolkit, Axios, React Router
- **Backend:** Spring Boot 3, Spring Security (Google OAuth), Spring Data JPA
- **Database:** MySQL

## Project Structure

```
Food delivery app/
├── backend/     # Spring Boot REST API
├── frontend/    # React SPA
└── README.md
```

## Prerequisites

- JDK 17+
- Node.js 18+
- MySQL 8+
- Google OAuth 2.0 credentials

## Setup

### 1. Database

```sql
CREATE DATABASE food_delivery_db;
```

### 2. Backend

```bash
cd backend
# Set environment variables (see backend/.env.example)
mvn spring-boot:run
```

API runs at `http://localhost:8080`

On first startup with an empty database, sample restaurants and food items are loaded automatically.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Google OAuth Setup

1. Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend environment

## Default Admin

After first login, promote a user to ADMIN in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

## API Base URL

`/api/v1`

## Features

- Google OAuth login
- Browse restaurants and food items
- Search and filter (location, rating, category, price)
- Shopping cart
- Order placement with QR payment simulation
- Order history
- Admin CRUD (restaurants, foods, categories, orders, users)
- Responsive design (mobile, tablet, desktop)

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel + Render production setup.
