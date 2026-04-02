const express = require("express");
const router = express.Router();

const { run, get, all } = require("../db");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.post("/:id/transactions", apiKeyMiddleware, async (req, res, next) => {
  try {
    const gameId = Number(req.params.id);
    const { type, amount } = req.body;

    if (!["income", "payout"].includes(type)) {
      return res.status(400).json({
        error: "type must be either 'income' or 'payout'",
      });
    }

    if (!Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({
        error: "amount must be an integer >= 1",
      });
    }

    const game = await get(
      `
      SELECT *
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

    if (game.status === "closed") {
      return res.status(400).json({
        error: "Game is closed",
      });
    }

    const jackpotBefore = game.current_jackpot;
    let jackpotAfter = jackpotBefore;

    if (type === "income") {
      jackpotAfter = jackpotBefore + amount;
    }

    if (type === "payout") {
      if (amount > jackpotBefore) {
        return res.status(400).json({
          error: "Payout exceeds current jackpot",
        });
      }
      jackpotAfter = jackpotBefore - amount;
    }

    await run(
      `
      INSERT INTO transactions (game_id, type, amount, jackpot_before, jackpot_after)
      VALUES (?, ?, ?, ?, ?)
      `,
      [gameId, type, amount, jackpotBefore, jackpotAfter]
    );

    await run(
      `
      UPDATE games
      SET current_jackpot = ?
      WHERE id = ?
      `,
      [jackpotAfter, gameId]
    );

    const updatedGame = await get(
      `
      SELECT id, name, current_jackpot, status
      FROM games
      WHERE id = ?
      `,
      [gameId]
    );

    res.status(201).json({
      message: "Transaction recorded successfully",
      transaction: {
        game_id: gameId,
        type,
        amount,
        jackpot_before: jackpotBefore,
        jackpot_after: jackpotAfter,
      },
      game: updatedGame,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/transactions", apiKeyMiddleware, async (req, res, next) => {
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

module.exports = router;