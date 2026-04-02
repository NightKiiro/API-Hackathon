const crypto = require("crypto");
const db = require("../db");

function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function createApiKey(userId) {
  return new Promise((resolve, reject) => {
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);

    db.run(
      "INSERT INTO api_keys (key_hash, user_id) VALUES (?, ?)",
      [keyHash, userId],
      function (err) {
        if (err) return reject(err);
        resolve(apiKey); // retournée une seule fois
      }
    );
  });
}

function revokeApiKey(key) {
  return new Promise((resolve, reject) => {
    const keyHash = hashApiKey(key);

    db.run(
      "UPDATE api_keys SET revoked = 1 WHERE key_hash = ?",
      [keyHash],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

module.exports = {
  generateApiKey,
  hashApiKey,
  createApiKey,
  revokeApiKey
};