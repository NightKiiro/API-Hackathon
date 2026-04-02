const express = require("express");
const router = express.Router();

const { run, get, all } = require("../db");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.post("/", apiKeyMiddleware, async (req, res, next) => {
  try {
    const { name, description = "", initial_jackpot } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "name is required",
      });
    }

    if (
      initial_jackpot === undefined ||
      !Number.isInteger(initial_jackpot) ||
      initial_jackpot < 0
    ) {
      return res.status(400).json({
        error: "initial_jackpot must be an integer >= 0",
      });
    }

    const existing = await get(
      `
      SELECT id
      FROM games
      WHERE creator_id = ? AND name = ?
      `,
      [req.user.id, name.trim()]
    );

    if (existing) {
      return res.status(409).json({
        error: "You already have a game with this name",
      });
    }

    const result = await run(
      `
      INSERT INTO games (creator_id, name, description, initial_jackpot, current_jackpot, status)
      VALUES (?, ?, ?, ?, ?, 'active')
      `,
      [req.user.id, name.trim(), description.trim(), initial_jackpot, initial_jackpot]
    );

    const game = await get(
      `
      SELECT *
      FROM games
      WHERE id = ?
      `,
      [result.id]
    );

    res.status(201).json({
      message: "Game created successfully",
      game,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/my-games", apiKeyMiddleware, async (req, res, next) => {
  try {
    const games = await all(
      `
      SELECT *
      FROM games
      WHERE creator_id = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(games);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);

    const game = await get(
      `
      SELECT *
      FROM creator_stats_view
      WHERE id = ? AND creator_id = ?
      `,
      [gameId, req.user.id]
    );

    if (!game) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    res.json(game);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);
    const { name, description, status } = req.body;

    const existing = await get(
      `
      SELECT *
      FROM games
      WHERE id = ? AND creator_id = ?
      `,
      [gameId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    const nextName = typeof name === "string" ? name.trim() : existing.name;
    const nextDescription =
      typeof description === "string" ? description.trim() : existing.description;
    const nextStatus =
      status === "active" || status === "closed" ? status : existing.status;

    await run(
      `
      UPDATE games
      SET name = ?, description = ?, status = ?
      WHERE id = ? AND creator_id = ?
      `,
      [nextName, nextDescription, nextStatus, gameId, req.user.id]
    );

    const updated = await get(
      `
      SELECT *
      FROM games
      WHERE id = ?
      `,
      [gameId]
    );

    res.json({
      message: "Game updated successfully",
      game: updated,
    });
  } catch (error) {
    if (error.message && error.message.includes("UNIQUE")) {
      return res.status(409).json({
        error: "You already have a game with this name",
      });
    }
    next(error);
  }
});

module.exports = router;