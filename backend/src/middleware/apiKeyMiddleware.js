const { hashApiKey } = require("../services/apiKeyService");
const db = require("../db");

async function apiKeyMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "API key manquante" });
  }

  const hashed = hashApiKey(key);

  try {
    db.get(
      "SELECT * FROM api_keys WHERE key_hash = ? AND revoked = 0",
      [hashed],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Erreur serveur" });
        }

        if (!row) {
          return res.status(403).json({ error: "API key invalide" });
        }

        req.user = row.user_id;
        next();
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = apiKeyMiddleware;