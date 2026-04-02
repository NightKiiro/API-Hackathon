# 🎰 EPI BET Casino Dashboard (Frontend)

## 🧠 Concept
Chaque jeu envoie ses transactions à une API centrale.
Le frontend permet de visualiser :
- le classement des jeux
- les performances
- les alertes en temps réel

Aucune donnée joueur n’est stockée.

---

## 🚀 Stack
- React 18 + Vite
- React Router
- Recharts
- CSS Modules
- Docker

---

## ⚙️ Installation

```bash
npm install
npm run dev
```

---

## 🔌 Connexion API

Créer un `.env` :

```env
VITE_API_URL=http://<IP_BACKEND>:8000
```

⚠️ Ne pas utiliser localhost en réseau.

---

## 🌐 Accès
http://localhost:5173

---

## 📊 Pages

### Leaderboard
- classement
- stats globales
- alertes

### My Game
- stats créateur
- transactions
- état du jackpot

---

## ⏱ Fonctionnement
Polling automatique (~5s)

---

## 🐳 Docker

```bash
docker build -t epi-bet-frontend .
docker run -p 3000:3000 epi-bet-frontend
```

⚠️ Mode dev uniquement.
