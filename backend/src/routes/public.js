const express = require("express");
const router = express.Router();

const { all, get } = require("../db");

router.get("/ranking", async (req, res, next) => {
  try {
    const ranking = await all(
      `
      SELECT *
      FROM ranking_view
      ORDER BY total_income DESC, total_payout ASC, current_jackpot DESC, id DESC
      `
    );

    res.json(ranking);
  } catch (error) {
    next(error);
  }
});

router.get("/alerts", async (req, res, next) => {
  try {
    const alerts = await all(
      `
      SELECT *
      FROM alerts
      ORDER BY created_at DESC, id DESC
      `
    );

    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const stats = await get(
      `
      SELECT
        COUNT(*) AS total_games,
        COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active_games,
        COALESCE(SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END), 0) AS closed_games,
        COALESCE(SUM(current_jackpot), 0) AS total_jackpot
      FROM games
      `
    );

    const transactionStats = await get(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'payout' THEN amount ELSE 0 END), 0) AS total_payouts,
        COUNT(*) AS total_transactions
      FROM transactions
      `
    );

    res.json({
      ...stats,
      ...transactionStats,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;