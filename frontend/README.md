# 🎰 EPITE Casino Dashboard

Hackathon dashboard — classement des jeux + vue créateur.

## Stack

- **React 18** + **Vite** — framework + bundler ultra-rapide
- **React Router v6** — navigation entre pages
- **Recharts** — graphiques (line chart, donut)
- **CSS Modules** — styles scopés par composant

## Structure

src/  
├── components/  
│ ├── Navbar  
│ ├── MetricCard  
│ ├── GameTable  
│ ├── TransactionFeed  
│ ├── JackpotAlert  
│ ├── ProfitChart  
│ └── WinRateChart  
│  
├── hooks/
│ └── usePolling.js  
│  
├── pages/
│ ├── Leaderboard.jsx  
│ └── MyGame.jsx  
│  
├── utils/
│ ├── api.js  
│ └── format.js  
│  
├── App.jsx  
├── main.jsx  
└── index.css  

## Installation & Lancement

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Concept

Ce frontend permet de visualiser en temps réel les performances des jeux.

Deux interfaces principales :

### 🏆 Leaderboard

* classement des jeux
* métriques globales
* flux de transactions
* alertes visuelles (ex: jackpot vide)

### 🎯 Dashboard créateur

* sélection d’un jeu
* affichage des statistiques
* suivi des transactions
* état du jackpot

## Fonctionnement

Le front est basé sur un système de **polling** (rafraîchissement automatique) :

Leaderboard → toutes les ~5 secondes
Dashboard → toutes les ~3–5 secondes

Les données sont récupérées via ```api.js``` et mises à jour dynamiquement dans les composants.

## UI / UX
* interface simple et lisible
* composants réutilisables
* mise en avant des métriques importantes
* couleurs pour différencier :
  * gains
  * pertes
  * états (actif / fermé)

## Composants clés
* **GameTable** → classement triable des jeux
* **TransactionFeed** → flux des transactions récentes
* **MetricCard** → affichage des indicateurs principaux
* **JackpotAlert** → alerte visuelle critique
* **Charts (Recharts)** → visualisation des performances

## Important
* aucune logique métier côté front
* aucune donnée sensible stockée
* le front sert uniquement de visualisation

## Objectif

Fournir une interface claire, rapide et efficace pour visualiser les performances des jeux en temps réel dans un contexte hackathon.