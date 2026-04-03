# 🎰 EpiBet — Plateforme temps réel

## 🧠 Concept

EpiBet est une plateforme permettant à des jeux d’envoyer leurs transactions à une API centrale, qui alimente un dashboard en temps réel.

## 🏗️ Architecture

```
[ Jeux ] ---> [ API (Node.js) ] ---> [ Dashboard (React) ]
                         │
                         └── [ SQLite DB ]
```

## ⚙️ Stack technique

**Backend**

* Node.js
* Express
* SQLite

**Frontend**

* React
* Vite

**Infra**

* Docker
* Docker Compose

---

## 📁 Structure du projet

```
backend/   → API + base SQLite + logique métier
frontend/  → Dashboard React
docker-compose.yml → orchestration des services
```

---

## 🚀 Lancement avec Docker (clean build recommandé)

```bash
docker compose down -v --rmi local
docker builder prune -af
docker compose build --no-cache
docker compose up
```

---

## 🌐 Accès

* Frontend : [http://localhost:3000](http://localhost:3000)
* API : [http://localhost:8000](http://localhost:8000)

*(Remplacer `localhost` par l’IP de la machine si déployé)*

---

## 🎮 Fonctionnement

### 1. Authentification

* Register d’un utilisateur
* Génération d’une clé API

### 2. Création de jeu

* Un créateur enregistre un jeu via l’API

### 3. Envoi de transactions

* Les jeux envoient des events :

  * mises
  * gains
  * jackpots

### 4. Dashboard temps réel

* Suivi des :

  * transactions
  * profits
  * classement

---

## 📡 API (aperçu)

Routes principales :

* `/auth` → authentification
* `/games` → gestion des jeux
* `/transactions` → envoi des transactions
* `/public` → données publiques dashboard
* `/creator` → stats créateur

---

## 🔐 Sécurité

* Authentification via clé API
* Rate limiting
* Whitelist possible
* Aucune donnée sensible joueur stockée

---

## 🗄️ Base de données

* SQLite embarquée
* Initialisation automatique (`initDb.js`)
* Scripts SQL :

  * schema
  * seed
  * triggers
  * views

---

## 🧪 Dev & debug

* `seed.js` → données de test
* `testQueries.js` → requêtes de validation

---

## 💬 Pitch

> Une API temps réel pour connecter des jeux à un dashboard live, avec analytics instantanés et intégration ultra simple.
