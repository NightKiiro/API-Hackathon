const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const { get, run, all } = require("../db");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const { canRegisterEmail, normalizeEmail } = require("../services/authService");
const {
  createApiKeyForCreator,
  revokeApiKey,
} = require("../services/apiKeyService");

router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email invalide")
      .normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Erreur de validation",
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      const emailCheck = canRegisterEmail(email);
      if (!emailCheck.ok) {
        return res.status(400).json({
          error: emailCheck.error,
        });
      }

      const normalizedEmail = normalizeEmail(email);

      const existingCreator = await get(
        `SELECT id, email FROM creators WHERE email = ?`,
        [normalizedEmail]
      );

      if (existingCreator) {
        const apiKey = await createApiKeyForCreator(existingCreator.id);

        return res.status(200).json({
          message: "Nouvelle clé API générée",
          creator: {
            id: existingCreator.id,
            email: existingCreator.email,
          },
          apiKey,
        });
      }

      const creatorInsert = await run(
        `
        INSERT INTO creators (email)
        VALUES (?)
        `,
        [normalizedEmail]
      );

      const apiKey = await createApiKeyForCreator(creatorInsert.id);

      return res.status(201).json({
        message: "Créateur inscrit avec succès",
        creator: {
          id: creatorInsert.id,
          email: normalizedEmail,
        },
        apiKey,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      next(error);
    }
  }
);

router.post("/api-keys", apiKeyMiddleware, async (req, res, next) => {
  try {
    const apiKey = await createApiKeyForCreator(req.user.id);

    res.status(201).json({
      message: "API key created successfully",
      apiKey,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api-keys", apiKeyMiddleware, async (req, res, next) => {
  try {
    const keys = await all(
      `
      SELECT id, revoked, created_at
      FROM api_keys
      WHERE creator_id = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(keys);
  } catch (error) {
    next(error);
  }
});

router.delete("/api-keys/revoke", apiKeyMiddleware, async (req, res, next) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: "apiKey is required",
      });
    }

    const revoked = await revokeApiKey(apiKey);

    if (!revoked) {
      return res.status(404).json({
        error: "API key not found",
      });
    }

    res.json({
      message: "API key revoked successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", apiKeyMiddleware, async (req, res, next) => {
  try {
    const creator = await get(
      `
      SELECT id, email, created_at
      FROM creators
      WHERE id = ?
      `,
      [req.user.id]
    );

    res.json({ creator });
  } catch (error) {
    next(error);
  }
});

module.exports = router;