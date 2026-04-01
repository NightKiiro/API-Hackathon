const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/public/games
 * Liste des jeux actifs (status = 'active')
 */
router.get('/games', (req, res) => {
  db.all(
    `SELECT id, name, description, initial_jackpot, current_jackpot, status 
     FROM games 
     WHERE status = 'active'
     ORDER BY name`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(rows);
    }
  );
});

/**
 * GET /api/public/games/:id
 * Détails d'un jeu spécifique
 */
router.get('/games/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT id, name, description, initial_jackpot, current_jackpot, status 
     FROM games 
     WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Jeu non trouvé' });
      }
      res.json(row);
    }
  );
});

/**
 * GET /api/public/ranking
 * Classement des jeux (utilise la view ranking_view)
 */
router.get('/ranking', (req, res) => {
  db.all(
    `SELECT * FROM ranking_view ORDER BY plays DESC, profit DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(rows);
    }
  );
});

/**
 * GET /api/public/alerts
 * Récupère toutes les alertes
 */
router.get('/alerts', (req, res) => {
  db.all(
    `SELECT a.*, g.name as game_name 
     FROM alerts a
     JOIN games g ON a.game_id = g.id
     ORDER BY a.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(rows);
    }
  );
});

/**
 * GET /api/public/stats
 * Statistiques globales
 */
router.get('/stats', (req, res) => {
  db.get(
    `SELECT 
       COUNT(DISTINCT g.id) as total_games,
       COUNT(DISTINCT t.player_email) as total_players,
       COUNT(CASE WHEN t.type = 'play' THEN 1 END) as total_plays,
       COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
       COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) as total_payouts
     FROM games g
     LEFT JOIN transactions t ON g.id = t.game_id
     WHERE g.status = 'active'`,
    [],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(row || { total_games: 0, total_players: 0, total_plays: 0, total_income: 0, total_payouts: 0 });
    }
  );
});

module.exports = router;