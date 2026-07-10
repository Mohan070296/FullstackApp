# Deployment Guide

## Architecture

- **Frontend:** Vercel (React SPA)
- **Backend:** Render (Spring Boot Docker)
- **Database:** Managed MySQL (Railway, PlanetScale, or Render MySQL)

## 1. Database

Create a MySQL database and note the connection URL, username, and password.

```sql
CREATE DATABASE food_delivery_db;
```

## 2. Backend (Render)

1. Connect your GitHub repo to Render
2. Use the [`render.yaml`](render.yaml) blueprint or create a Web Service manually:
   - **Root directory:** `backend`
   - **Runtime:** Docker
   - **Dockerfile path:** `backend/Dockerfile`
3. Set environment variables:

| Variable | Example |
|----------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:mysql://host:3306/food_delivery_db?useSSL=true&serverTimezone=UTC` |
| `DB_USERNAME` | your db user |
| `DB_PASSWORD` | your db password |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | your admin Google email |

4. Note your backend URL, e.g. `https://food-delivery-backend.onrender.com`

## 3. Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/):

1. Add **Authorized redirect URI:**
   - Dev: `http://localhost:8080/login/oauth2/code/google`
   - Prod: `https://your-backend.onrender.com/login/oauth2/code/google`
2. Add **Authorized JavaScript origins** (optional):
   - `http://localhost:5173`
   - `https://your-app.vercel.app`

## 4. Frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set environment variables:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api/v1` |
| `VITE_OAUTH_URL` | `https://your-backend.onrender.com/oauth2/authorization/google` |

4. Deploy — Vercel uses [`frontend/vercel.json`](frontend/vercel.json) for SPA routing

## 5. Post-deploy checklist

- [ ] Browse restaurants/foods on production frontend
- [ ] Google login redirects back and session works (cross-origin cookies)
- [ ] Cart → checkout → QR payment → order success flow works
- [ ] Admin dashboard accessible for ADMIN role user

## Local development

```bash
# Backend
cd backend
# Set env vars from .env.example
mvn spring-boot:run

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```
