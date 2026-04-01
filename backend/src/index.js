const express = require('express');
const cors = require('cors');

// Import des routeurs
const publicRoutes = require('./routes/public');
const gamesRoutes = require('./routes/games');
const creatorRoutes = require('./routes/creator');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');

// Import du middleware d'authentification
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes publiques (pas d'authentification)
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);

// Routes protégées par clé API
app.use('/api/games', apiKeyMiddleware, gamesRoutes);
app.use('/api/creator', apiKeyMiddleware, creatorRoutes);
app.use('/api/transactions', apiKeyMiddleware, transactionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 - Route non trouvée
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// 500 - Erreur serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});