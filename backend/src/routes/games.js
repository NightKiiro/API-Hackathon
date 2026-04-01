const express = require('express');
const router = express.Router();
const db = require('../db');

const getCreatorById = (userId, callback) => {
  db.get('SELECT * FROM creators WHERE email = ?', [userId], (err, row) => {
    callback(err, row);
  });
};

/**
 * POST /api/games
 * Créer un nouveau jeu
 */
router.post('/', (req, res) => {
  const userId = req.user;
  const { name, description, initial_jackpot = 30 } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name est requis' });
  }
  if (initial_jackpot < 0) {
    return res.status(400).json({ error: 'initial_jackpot doit être >= 0' });
  }

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.run(
      `INSERT INTO games (creator_id, name, description, initial_jackpot, current_jackpot, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [creator.id, name, description, initial_jackpot, initial_jackpot],
      function (err) {
        if (err) {
          console.error(err);
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Un jeu avec ce nom existe déjà' });
          }
          return res.status(500).json({ error: 'Erreur lors de la création' });
        }

        res.status(201).json({
          id: this.lastID,
          name,
          initial_jackpot,
          current_jackpot: initial_jackpot,
          message: 'Jeu créé avec succès'
        });
      }
    );
  });
});

/**
 * PUT /api/games/:id
 * Modifier un jeu (uniquement la description)
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  const { description } = req.body;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.get('SELECT * FROM games WHERE id = ?', [id], (err, game) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!game) {
        return res.status(404).json({ error: 'Jeu non trouvé' });
      }
      if (game.creator_id !== creator.id) {
        return res.status(403).json({ error: 'Vous n\'êtes pas le créateur' });
      }

      if (description !== undefined) {
        db.run(
          'UPDATE games SET description = ? WHERE id = ?',
          [description, id],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
            }
            res.json({ message: 'Jeu mis à jour avec succès' });
          }
        );
      } else {
        res.json({ message: 'Aucune modification' });
      }
    });
  });
});

/**
 * DELETE /api/games/:id
 * Fermer un jeu (soft delete)
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.run(
      'UPDATE games SET status = "closed" WHERE id = ? AND creator_id = ?',
      [id, creator.id],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erreur lors de la fermeture' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Jeu non trouvé ou non autorisé' });
        }
        res.json({ message: 'Jeu fermé avec succès' });
      }
    );
  });
});

/**
 * GET /api/games/:id/stats
 * Statistiques d'un jeu spécifique
 */
router.get('/:id/stats', (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  getCreatorById(userId, (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(403).json({ error: 'Créateur non trouvé' });
    }

    db.get('SELECT * FROM games WHERE id = ?', [id], (err, game) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!game) {
        return res.status(404).json({ error: 'Jeu non trouvé' });
      }
      if (game.creator_id !== creator.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      db.get(
        `SELECT * FROM creator_stats_view WHERE game_id = ?`,
        [id],
        (err, stats) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
          }
          res.json({
            game: {
              id: game.id,
              name: game.name,
              current_jackpot: game.current_jackpot,
              initial_jackpot: game.initial_jackpot,
              status: game.status
            },
            stats: stats || { plays: 0, income: 0, payout: 0, profit: 0 }
          });
        }
      );
    });
  });
});

module.exports = router;