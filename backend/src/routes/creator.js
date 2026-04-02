const express = require("express");
const router = express.Router();

const { all, get } = require("../db");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.get("/overview", apiKeyMiddleware, async (req, res, next) => {
  try {
    const games = await all(
      `
      SELECT *
      FROM creator_stats_view
      WHERE creator_id = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    const summary = await get(
      `
      SELECT
        COUNT(*) AS total_games,
        COALESCE(SUM(current_jackpot), 0) AS total_current_jackpot,
        COALESCE(SUM(total_income), 0) AS total_income,
        COALESCE(SUM(total_payout), 0) AS total_payout,
        COALESCE(SUM(net_revenue), 0) AS total_net_revenue
      FROM creator_stats_view
      WHERE creator_id = ?
      `,
      [req.user.id]
    );

    res.json({
      summary,
      games,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/games/:id/stats", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);

    const stats = await get(
      `
      SELECT *
      FROM creator_stats_view
      WHERE id = ? AND creator_id = ?
      `,
      [gameId, req.user.id]
    );

    if (!stats) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get("/games/:id/transactions", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);

    const game = await get(
      `
      SELECT id
      FROM games
      WHERE id = ? AND creator_id = ?
      `,
      [gameId, req.user.id]
    );

    if (!game) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    const transactions = await all(
      `
      SELECT id, game_id, type, amount, jackpot_before, jackpot_after, created_at
      FROM transactions
      WHERE game_id = ?
      ORDER BY id DESC
      `,
      [gameId]
    );

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.get("/games/:id/alerts", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);

    const game = await get(
      `
      SELECT id
      FROM games
      WHERE id = ? AND creator_id = ?
      `,
      [gameId, req.user.id]
    );

    if (!game) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    const alerts = await all(
      `
      SELECT *
      FROM alerts
      WHERE game_id = ?
      ORDER BY created_at DESC, id DESC
      `,
      [gameId]
    );

    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;