# 🎰 EPI BET Casino Dashboard

Hackathon dashboard pour visualiser les performances des jeux en temps réel et suivre l’activité des créateurs.

---

## 🚀 Stack technique

* **React 18** + **Vite** — framework moderne + bundler ultra-rapide
* **React Router v6** — navigation fluide entre pages
* **Recharts** — graphiques dynamiques (line chart, donut chart)
* **CSS Modules** — styles scoped par composant pour éviter les conflits
* **Docker** — conteneurisation pour exécuter facilement l’application

---

## 📁 Structure du projet

```plaintext
.
├── Dockerfile
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── App.module.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.module.css
│   │   ├── MetricCard.jsx
│   │   ├── MetricCard.module.css
│   │   ├── GameTable.jsx
│   │   ├── GameTable.module.css
│   │   ├── TransactionFeed.jsx
│   │   ├── TransactionFeed.module.css
│   │   ├── JackpotAlert.jsx
│   │   ├── JackpotAlert.module.css
│   │   ├── ProfitChart.jsx
│   │   ├── ProfitChart.module.css
│   │   ├── WinRateChart.jsx
│   │   ├── WinRateChart.module.css
│   │   ├── PlayerList.jsx
│   │   └── PlayerList.module.css
│   ├── hooks/
│   │   └── usePolling.js
│   ├── pages/
│   │   ├── Leaderboard.jsx
│   │   ├── Leaderboard.module.css
│   │   ├── MyGame.jsx
│   │   └── MyGame.module.css
│   └── utils/
│       ├── api.js
│       └── format.js
```

---

## ⚡ Installation & lancement

### 🔹 Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → Ouvrir http://localhost:5173
```

### 🐳 Avec Docker

```bash
# Construire l'image Docker
docker build -t epi_bet-casino-dashboard .

# Lancer le conteneur
docker run -p 3000:3000 epi_bet-casino-dashboard

# → Accéder à http://localhost:3000
```

> Le conteneur exécute le serveur Vite en mode développement sur le port 3000.

---

## 🎯 Concept

EPI BET Casino Dashboard permet de visualiser **en temps réel** les performances des jeux et les activités des créateurs.

### 🏆 Leaderboard

* Classement triable des jeux
* Indicateurs globaux (profit, win rate…)
* Flux des transactions récentes
* Alertes critiques (ex: jackpot vide)

### 🎨 Dashboard créateur

* Sélection d’un jeu spécifique
* Visualisation détaillée des statistiques
* Suivi du flux des transactions
* État du jackpot en temps réel

---

## ⏱ Fonctionnement

Le frontend utilise un système de **polling** pour rafraîchir automatiquement les données :

| Page        | Fréquence     |  
| ----------- | ------------- |  
| Leaderboard | ~5 secondes   |  
| Dashboard   | ~3–5 secondes |  

Les données sont récupérées via `src/utils/api.js` et mises à jour dynamiquement dans les composants.

---

## 🎨 UI / UX

* Interface claire et lisible
* Composants modulaires et réutilisables
* Mise en avant des métriques critiques
* Codes couleurs pour visualiser rapidement :

  * Gains vs pertes
  * Statut actif / fermé

---

## 🧩 Composants clés

* **Navbar** → navigation entre pages
* **GameTable** → classement des jeux, triable et filtrable
* **TransactionFeed** → flux en temps réel des transactions
* **MetricCard** → indicateurs principaux (profit, jackpot, win rate…)
* **JackpotAlert** → alertes critiques pour jackpots
* **ProfitChart / WinRateChart** → graphiques de performance interactifs
* **PlayerList** → liste des joueurs récents ou actifs

---

## 🎯 Objectif

Fournir une interface rapide, intuitive et réactive pour suivre les performances des jeux dans un contexte hackathon, tout en facilitant la prise de décision pour les créateurs.
