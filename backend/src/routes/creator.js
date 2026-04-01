const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Fonction utilitaire pour récupérer un créateur à partir de son ID/email
 */
const getCreatorById = (userId, callback) => {
  db.get('SELECT * FROM creators WHERE email = ?', [userId], (err, row) => {
    callback(err, row);
  });
};

/**
 * GET /api/creator/dashboard
 * Dashboard complet du créateur
 */
router.get('/dashboard', (req, res) => {
  const userId = req.user;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    // Statistiques globales du créateur
    db.get(
      `SELECT 
         COUNT(*) as total_games,
         COALESCE(SUM(current_jackpot), 0) as total_jackpot,
         COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_games
       FROM games
       WHERE creator_id = ?`,
      [creator.id],
      (err, stats) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        // Liste des jeux avec leurs stats via la view
        db.all(
          `SELECT * FROM creator_stats_view WHERE creator_id = ? ORDER BY created_at DESC`,
          [creator.id],
          (err, games) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.json({
              creator: {
                id: creator.id,
                email: creator.email
              },
              stats: stats || { total_games: 0, total_jackpot: 0, closed_games: 0 },
              games: games || []
            });
          }
        );
      }
    );
  });
});

/**
 * GET /api/creator/games/:gameId/transactions
 * Historique des transactions d'un jeu
 */
router.get('/games/:gameId/transactions', (req, res) => {
  const { gameId } = req.params;
  const userId = req.user;
  const { limit = 50 } = req.query;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.get('SELECT * FROM games WHERE id = ? AND creator_id = ?', [gameId, creator.id], (err, game) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!game) {
        return res.status(403).json({ error: 'Non autorisé ou jeu non trouvé' });
      }

      db.all(
        `SELECT * FROM transactions 
         WHERE game_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [gameId, parseInt(limit)],
        (err, transactions) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
          }

          db.get(
            'SELECT COUNT(*) as total FROM transactions WHERE game_id = ?',
            [gameId],
            (err, count) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur serveur' });
              }

              res.json({
                game: {
                  id: game.id,
                  name: game.name,
                  current_jackpot: game.current_jackpot
                },
                transactions,
                total: count.total,
                limit: parseInt(limit)
              });
            }
          );
        }
      );
    });
  });
});

/**
 * GET /api/creator/games/:gameId/alerts
 * Alertes d'un jeu
 */
router.get('/games/:gameId/alerts', (req, res) => {
  const { gameId } = req.params;
  const userId = req.user;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.get('SELECT * FROM games WHERE id = ? AND creator_id = ?', [gameId, creator.id], (err, game) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!game) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      db.all(
        `SELECT * FROM alerts WHERE game_id = ? ORDER BY created_at DESC`,
        [gameId],
        (err, alerts) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
          }
          res.json(alerts);
        }
      );
    });
  });
});

module.exports = router;