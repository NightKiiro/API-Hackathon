# 🖥️ EPI BET Backend

## 🧠 Concept
Le backend reçoit uniquement des transactions :
- income → joueur paye
- payout → joueur gagne

Aucune donnée joueur n’est stockée.

---

## 🚀 Stack
- Node.js
- Express
- SQLite
- Docker

---

## ⚙️ Installation

```bash
npm install
node src/initDb.js
node src/index.js
```

---

## 🌐 API
http://localhost:8000

---

## 🔐 Auth
Header :
X-API-Key: epibet_xxxxx

---

## 📡 Routes

### Auth
- POST /auth/register
- GET /auth/me

### Games
- POST /games
- GET /games/my-games

### Transactions
- POST /games/:id/transactions

### Public
- GET /public/ranking
- GET /public/stats
- GET /public/alerts

### Creator
- GET /creator/overview
- GET /creator/games/:id/stats
- GET /creator/games/:id/transactions

---

## 🗄 DB
SQLite avec :
- schema.sql
- views.sql
- triggers.sql

---

## 🐳 Docker

```bash
docker build -t epi-bet-backend .
docker run -p 8000:8000 epi-bet-backend
```
