const crypto = require("crypto");

// génère une clé API (à donner au user)
function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

// hash pour stockage DB
function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

module.exports = {
  generateApiKey,
  hashApiKey
};