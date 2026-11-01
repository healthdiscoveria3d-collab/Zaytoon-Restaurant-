# Zaytoon Restaurant — Deployment Guide

## 1. Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express + Vite)
npm run dev

# 3. Access in browser
http://localhost:3000
```

## 2. Production Build & Execution
```bash
# Build frontend static bundle
npm run build

# Start production server
npm start
```

## 3. Render Deployment
Deploy easily via Render's Web Service or the included `render.yaml` blueprint.

### Environment Variables
| Variable | Value / Description | Required |
|---|---|---|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3000` (or Render standard `$PORT`) | Yes |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/zaytoondb` | In production |

### Build Command
`npm install && npm run build`

### Start Command
`npm start`

### Health Check Endpoint
`GET /api/health`
