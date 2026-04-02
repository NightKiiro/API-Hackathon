# 🎰 EPITE Casino Dashboard

Hackathon dashboard — classement des jeux + vue créateur.

## Stack

- **React 18** + **Vite** — framework + bundler ultra-rapide
- **React Router v6** — navigation entre pages
- **Recharts** — graphiques (line chart, donut)
- **CSS Modules** — styles scopés par composant

## Structure

```
src/
├── components/       # Briques UI réutilisables
│   ├── Navbar        # Barre de navigation
│   ├── MetricCard    # Carte de métrique (chiffre + label)
│   ├── GameTable     # Tableau classement des jeux (triable)
│   ├── PlayerList    # Classement joueurs
│   ├── TransactionFeed # Feed transactions en live
│   ├── JackpotAlert  # Bannière d'alerte jackpot
│   ├── ProfitChart   # Graphique ligne — profit dans le temps
│   └── WinRateChart  # Graphique donut — distribution gains/pertes
│
├── hooks/
│   └── usePolling.js  # Hook de polling — refresh auto toutes les Xs
│
├── pages/
│   ├── Leaderboard.jsx  # /leaderboard — vue publique
│   └── MyGame.jsx       # /my-game — vue créateur
│
├── utils/
│   ├── api.js      # Toutes les fonctions fetch() centralisées
│   └── format.js   # Helpers de formatage (coins, nombres, temps)
│
├── App.jsx          # Router principal
├── main.jsx         # Point d'entrée React
└── index.css        # Variables CSS globales + reset
```

## Installation & Lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'API
cp .env.example .env
# Éditer .env et mettre l'URL de votre API

# 3. Lancer en développement
npm run dev
# → http://localhost:5173

# 4. Build pour production
npm run build
npm run preview
```

## Brancher votre vraie API

Dans `src/pages/Leaderboard.jsx` et `src/pages/MyGame.jsx`,
changez simplement `USE_MOCK = true` en `USE_MOCK = false`.

Votre API doit retourner ces formats :

### GET /api/games
```json
[
  {
    "id": 1,
    "name": "StarForge",
    "emoji": "🚀",
    "type": "Tirage",
    "team": "NeonByte",
    "plays": 312,
    "wagered": 624,
    "profit": 87,
    "jackpot": 87,
    "jackpotMax": 200,
    "status": "open"
  }
]
```

### GET /api/games/:id
```json
{
  "...": "même champs que ci-dessus",
  "profitHistory": [2, 5, 8, 12, 18, 24, 31, 41, 51, 62, 74, 87],
  "winRate": [55, 30, 15]
}
```

### GET /api/players/leaderboard
```json
[
  { "id": 1, "name": "Alex B.", "initials": "AB", "color": "#7b5cff", "coins": 38, "plays": 24, "wins": 18 }
]
```

### GET /api/transactions?limit=10
```json
[
  { "id": 1, "emoji": "🚀", "game": "StarForge", "player": "Alex B.", "bet": 2, "result": "win", "gain": 4, "timestamp": "2025-04-03T10:00:00Z" }
]
```
