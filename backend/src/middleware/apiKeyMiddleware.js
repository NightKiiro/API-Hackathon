const crypto = require("crypto");

// ⚠️ temporaire (plus tard DB backend SQL)
const apiKeys = [];

function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function apiKeyMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "API key manquante" });
  }

  const hashed = hashApiKey(key);

  const valid = apiKeys.find(k => k.keyHash === hashed);

  if (!valid) {
    return res.status(403).json({ error: "API key invalide" });
  }

  req.user = valid.userId;
  next();
}

module.exports = apiKeyMiddleware;