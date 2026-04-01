const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Fonction qui calcule le gain en fonction de la mise et du jackpot
 * 
 * Règles :
 * - 30% de chance de gagner
 * - Multiplicateur aléatoire entre 1x et 5x
 * - Le gain ne peut pas dépasser le jackpot
 */
const calculateWin = (betAmount, currentJackpot) => {
  const winProbability = 0.3;  // 30% de chance de gagner
  const isWin = Math.random() < winProbability;
  
  if (!isWin) {
    return 0;
  }
  
  const multiplier = Math.floor(Math.random() * 5) + 1;  // 1 à 5
  let winAmount = betAmount * multiplier;
  
  return Math.min(winAmount, currentJackpot);
};

/**
 * POST /api/transactions/:gameId
 * Faire une mise sur un jeu
 */
router.post('/:gameId', (req, res) => {
  const { gameId } = req.params;
  const { player_email, bet_amount } = req.body;

  if (!player_email || !bet_amount) {
    return res.status(400).json({ error: 'player_email et bet_amount requis' });
  }

  if (bet_amount < 1) {
    return res.status(400).json({ error: 'La mise doit être >= 1' });
  }


  db.get(
    'SELECT * FROM games WHERE id = ? AND status = "active"',
    [gameId],
    (err, game) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      if (!game) {
        return res.status(404).json({ error: 'Jeu non trouvé ou fermé' });
      }

      const maxPossibleWin = bet_amount * 5;
      if (maxPossibleWin > game.current_jackpot) {
        return res.status(400).json({
          error: `Le gain maximum (${maxPossibleWin}) dépasse le jackpot (${game.current_jackpot})`,
          current_jackpot: game.current_jackpot,
          max_possible_win: maxPossibleWin
        });
      }

      const winAmount = calculateWin(bet_amount, game.current_jackpot);
      const jackpotBefore = game.current_jackpot;
      const jackpotAfter = jackpotBefore - winAmount;

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Transaction de type 'play'
        db.run(
          `INSERT INTO transactions (game_id, player_email, type, amount, jackpot_before, jackpot_after)
           VALUES (?, ?, 'play', ?, ?, ?)`,
          [gameId, player_email, bet_amount, jackpotBefore, jackpotAfter],
          function (err) {
            if (err) {
              console.error(err);
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Erreur création transaction play' });
            }
          }
        );

        // Transaction de type 'payout' si gain
        if (winAmount > 0) {
          db.run(
            `INSERT INTO transactions (game_id, player_email, type, amount, jackpot_before, jackpot_after)
             VALUES (?, ?, 'payout', ?, ?, ?)`,
            [gameId, player_email, winAmount, jackpotBefore, jackpotAfter],
            function (err) {
              if (err) {
                console.error(err);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Erreur création transaction payout' });
              }
            }
          );
        }

        // Mise à jour du jackpot
        db.run(
          'UPDATE games SET current_jackpot = ? WHERE id = ?',
          [jackpotAfter, gameId],
          function (err) {
            if (err) {
              console.error(err);
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Erreur mise à jour jackpot' });
            }
          }
        );

        // Validation
        db.run('COMMIT', (err) => {
          if (err) {
            console.error(err);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Erreur validation transaction' });
          }

          // Le trigger SQL s'occupe de fermer le jeu et créer l'alerte si jackpot = 0

          res.json({
            success: true,
            game_id: parseInt(gameId),
            game_name: game.name,
            player_email,
            bet_amount,
            win_amount: winAmount,
            is_win: winAmount > 0,
            jackpot_before: jackpotBefore,
            jackpot_after: jackpotAfter,
            message: winAmount > 0
              ? `Félicitations ! Vous avez gagné ${winAmount} pièces !`
              : `Dommage, vous avez perdu ${bet_amount} pièces.`,
            timestamp: new Date().toISOString()
          });
        });
      });
    }
  );
});

/**
 * GET /api/transactions/history/:player_email
 * Historique des transactions d'un joueur
 */
router.get('/history/:player_email', (req, res) => {
  const { player_email } = req.params;
  const { limit = 50 } = req.query;

  db.all(
    `SELECT t.*, g.name as game_name 
     FROM transactions t
     JOIN games g ON t.game_id = g.id
     WHERE t.player_email = ?
     ORDER BY t.created_at DESC
     LIMIT ?`,
    [player_email, parseInt(limit)],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      db.get(
        'SELECT COUNT(*) as total FROM transactions WHERE player_email = ?',
        [player_email],
        (err, count) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
          }

          res.json({
            player_email,
            transactions: rows,
            total: count.total,
            limit: parseInt(limit)
          });
        }
      );
    }
  );
});

/**
 * GET /api/transactions/stats/:player_email
 * Statistiques d'un joueur
 */
router.get('/stats/:player_email', (req, res) => {
  const { player_email } = req.params;

  db.get(
    `SELECT 
       COUNT(CASE WHEN type = 'play' THEN 1 END) as total_plays,
       COUNT(CASE WHEN type = 'payout' THEN 1 END) as total_wins,
       COALESCE(SUM(CASE WHEN type = 'play' THEN amount ELSE 0 END), 0) as total_bet_amount,
       COALESCE(SUM(CASE WHEN type = 'payout' THEN amount ELSE 0 END), 0) as total_win_amount,
       (COALESCE(SUM(CASE WHEN type = 'payout' THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 'play' THEN amount ELSE 0 END), 0)) as net_result,
       COUNT(DISTINCT game_id) as games_played
     FROM transactions 
     WHERE player_email = ?`,
    [player_email],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      const totalPlays = row?.total_plays || 0;
      const totalWins = row?.total_wins || 0;
      const winRate = totalPlays > 0 ? (totalWins / totalPlays * 100).toFixed(2) : 0;

      res.json({
        player_email,
        stats: {
          total_plays: totalPlays,
          total_wins: totalWins,
          win_rate: `${winRate}%`,
          total_bet_amount: row?.total_bet_amount || 0,
          total_win_amount: row?.total_win_amount || 0,
          net_result: row?.net_result || 0,
          games_played: row?.games_played || 0
        }
      });
    }
  );
});

module.exports = router;