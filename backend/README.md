# 🖥️ EPI BET Casino Backend

Backend Node.js/Express pour le dashboard EPI BET Casino, fournissant les données en temps réel pour le frontend.

---

## 🚀 Stack technique

* **Node.js 20** + **Express** — serveur backend rapide et léger
* **SQLite** — base de données embarquée (`epibet.db`)
* **Docker** — conteneurisation pour un déploiement simple
* Middleware pour **API Key** et **Rate Limiting**
* Architecture modulaire avec routes, services et middleware

---

## 📁 Structure du projet

```plaintext
.
├── Dockerfile
├── epibet.db
├── package.json
├── package-lock.json
└── src/
    ├── config/
    │   └── whitelist.js
    ├── DB_CONTRACT.md
    ├── db.js
    ├── index.js
    ├── initDb.js
    ├── middleware/
    │   ├── apiKeyMiddleware.js
    │   └── rateLimit.js
    ├── routes/
    │   ├── auth.js
    │   ├── creator.js
    │   ├── games.js
    │   ├── public.js
    │   └── transactions.js
    ├── seed.js
    ├── services/
    │   ├── apiKeyService.js
    │   └── authService.js
    ├── sql/
    │   ├── alerts.sql
    │   ├── creatorStats.sql
    │   ├── gameTransactions.sql
    │   ├── ranking.sql
    │   ├── schema.sql
    │   ├── seed.sql
    │   ├── triggers.sql
    │   └── views.sql
    └── testQueries.js
```

---

## ⚡ Installation & lancement

### 🔹 Développement local

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
node src/initDb.jsepi_bet

# Lancer le serveur
node src/index.js
# → Serveur accessible sur http://localhost:8000
```

### 🐳 Avec Docker

```bash
# Construire l'image Docker
docker build -t epi_bet-casino-backend .

# Lancer le conteneur
docker run -p 8000:8000 epi_bet-casino-backend

# → Accéder au serveur sur http://localhost:8000
```

> Le conteneur exécute le serveur Node.js sur le port `8000` tel que défini dans le Dockerfile.

---

## 🎯 Concept

Le backend gère les données nécessaires au dashboard :

* Gestion des jeux et transactions
* Authentification et API Key pour sécuriser l’accès
* Statistiques et ranking des jeux
* Flux public pour le frontend et le leaderboard

---

## 🗂 Routes principales

| Route                   | Description                                            |  
| ----------------------- | ------------------------------------------------------ |  
| `GET /api/games`        | Liste des jeux et stats globales                       |  
| `GET /api/transactions` | Flux des transactions récentes                         |  
| `GET /api/creators/:id` | Statistiques d’un créateur                             |  
| `POST /api/auth`        | Authentification des créateurs                         |  
| `GET /api/public/*`     | Accès public pour leaderboard et données non sensibles |  

> Toutes les routes sensibles sont protégées par **API Key** et **rate limiting**.

---

## 🧩 Middleware clés

* **apiKeyMiddleware** → vérifie les clés API valides
* **rateLimit** → limite les requêtes pour éviter les abus

---

## 🗄 Base de données

* **SQLite** (`epibet.db`) pour stocker les jeux, transactions et créateurs
* Scripts SQL disponibles dans `src/sql/` :

  * `schema.sql` → structure de la DB
  * `seed.sql` → données initiales
  * `views.sql`, `triggers.sql`, `alerts.sql` → logique et calculs automatisés

---

## 🎯 Objectif

Fournir un serveur fiable et sécurisé pour le dashboard epi_bet Casino, capable de :

* Servir les données en temps réel pour le leaderboard et les dashboards créateurs
* Gérer les transactions et alertes
* Assurer un accès sécurisé via API Key et limitation de trafic
