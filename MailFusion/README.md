# MailFusion

Production-focused email platform with authentication, single send, bulk campaigns, queue processing, templates, history, and provider switching.

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Redux Toolkit, Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, BullMQ, Redis, Multer, csv-parser
- Email Providers: Resend, Sendgrid, SMTP/Nodemailer

## Features Implemented

- Auth: register, login, logout with JWT
- Single email send with status logging
- Bulk email campaigns via CSV upload or pasted email list
- Delay between bulk emails (1/3/5/10 sec or custom)
- Queue system using BullMQ + Redis worker
- Template CRUD with variable placeholders (example: {{name}})
- Dashboard cards + recent logs
- Campaign tracking (pending/running/completed/failed)
- Email history with filters
- Settings to switch provider and API/SMTP credentials
- Security middleware: helmet, cors, rate-limit

## Project Structure

- server/src
  - config, controllers, middleware, models, queues, routes, services, workers
- client/src
  - api, app, features, components, pages

## Environment Setup

### Backend

1. Copy server/.env.example to server/.env
2. Fill values:
   - MONGO_URI
   - REDIS_URL
   - JWT_SECRET
   - MAIL_PROVIDER and provider credentials

### Frontend

1. Copy client/.env.example to client/.env
2. Set VITE_API_BASE_URL (default: http://localhost:5000/api)

## Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Production

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run build
npm run preview
```

## API Overview

- Auth: /api/auth/register, /api/auth/login, /api/auth/logout
- Email: /api/email/send
- Bulk: /api/bulk/send
- Templates: /api/templates
- Campaigns: /api/campaigns
- History: /api/history
- Dashboard: /api/dashboard
- Settings: /api/settings

## Notes

- Redis and MongoDB are required for queue + persistence.
- Provider switching can be controlled by env defaults and per-user settings in DB.
- Queue worker runs in the same backend process at startup.
