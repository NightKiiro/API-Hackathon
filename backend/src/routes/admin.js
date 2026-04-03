const express = require("express");
const router = express.Router();

const { all, get, run } = require("../db");

function checkAdmin(req, res, next) {
  const token = req.header("X-Admin-Token");
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return res.status(500).json({
      error: "ADMIN_TOKEN is not configured",
    });
  }

  if (!token || token !== expected) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  next();
}

router.use(checkAdmin);

/* ---------- READ HELPERS ---------- */

router.get("/health", async (req, res) => {
  res.json({ ok: true });
});

router.get("/creators", async (req, res, next) => {
  try {
    const creators = await all(`
      SELECT id, email, created_at
      FROM creators
      ORDER BY id ASC
    `);

    res.json(creators);
  } catch (error) {
    next(error);
  }
});

router.get("/games", async (req, res, next) => {
  try {
    const games = await all(`
      SELECT id, creator_id, name, description, initial_jackpot, current_jackpot, status, created_at
      FROM games
      ORDER BY id ASC
    `);

    res.json(games);
  } catch (error) {
    next(error);
  }
});

router.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await all(`
      SELECT id, game_id, type, amount, jackpot_before, jackpot_after, created_at
      FROM transactions
      ORDER BY id DESC
    `);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.get("/alerts", async (req, res, next) => {
  try {
    const alerts = await all(`
      SELECT id, game_id, message, created_at
      FROM alerts
      ORDER BY id DESC
    `);

    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.get("/overview", async (req, res, next) => {
  try {
    const creators = await get(`SELECT COUNT(*) AS total_creators FROM creators`);
    const games = await get(`SELECT COUNT(*) AS total_games FROM games`);
    const transactions = await get(`SELECT COUNT(*) AS total_transactions FROM transactions`);
    const alerts = await get(`SELECT COUNT(*) AS total_alerts FROM alerts`);

    res.json({
      ...creators,
      ...games,
      ...transactions,
      ...alerts,
    });
  } catch (error) {
    next(error);
  }
});

/* ---------- SQL READ ---------- */

router.post("/query", async (req, res, next) => {
  try {
    const { sql, params = [] } = req.body;

    if (!sql || typeof sql !== "string") {
      return res.status(400).json({
        error: "sql is required",
      });
    }

    const normalized = sql.trim().toLowerCase();

    if (!normalized.startsWith("select")) {
      return res.status(400).json({
        error: "Only SELECT queries are allowed on /admin/query",
      });
    }

    const rows = await all(sql, params);

    res.json({
      rows,
      count: rows.length,
    });
  } catch (error) {
    next(error);
  }
});

/* ---------- SQL WRITE ---------- */

router.post("/execute", async (req, res, next) => {
  try {
    const { sql, params = [] } = req.body;

    if (!sql || typeof sql !== "string") {
      return res.status(400).json({
        error: "sql is required",
      });
    }

    const normalized = sql.trim().toLowerCase();

    const allowed =
      normalized.startsWith("update") ||
      normalized.startsWith("delete") ||
      normalized.startsWith("insert");

    if (!allowed) {
      return res.status(400).json({
        error: "Only INSERT / UPDATE / DELETE are allowed on /admin/execute",
      });
    }

    const result = await run(sql, params);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
});

/* ---------- QUICK ACTIONS ---------- */

router.post("/reset-db", async (req, res, next) => {
  try {
    await run(`DELETE FROM alerts`);
    await run(`DELETE FROM transactions`);
    await run(`DELETE FROM api_keys`);
    await run(`DELETE FROM games`);
    await run(`DELETE FROM creators`);

    res.json({
      success: true,
      message: "Database data reset successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;