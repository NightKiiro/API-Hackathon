const crypto = require("crypto");
const { run, get } = require("../db");

function generateRawApiKey() {
  return `epibet_${crypto.randomBytes(24).toString("hex")}`;
}

function hashApiKey(rawKey) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

async function createApiKeyForCreator(creatorId) {
  const rawKey = generateRawApiKey();
  const keyHash = hashApiKey(rawKey);

  await run(
    `
    INSERT INTO api_keys (creator_id, key_hash, revoked)
    VALUES (?, ?, 0)
    `,
    [creatorId, keyHash]
  );

  return rawKey;
}

async function revokeApiKey(rawKey) {
  const keyHash = hashApiKey(rawKey);

  const result = await run(
    `
    UPDATE api_keys
    SET revoked = 1
    WHERE key_hash = ?
    `,
    [keyHash]
  );

  return result.changes > 0;
}

async function findCreatorByApiKey(rawKey) {
  const keyHash = hashApiKey(rawKey);

  return get(
    `
    SELECT
      ak.id AS api_key_id,
      ak.creator_id,
      c.email
    FROM api_keys ak
    INNER JOIN creators c ON c.id = ak.creator_id
    WHERE ak.key_hash = ? AND ak.revoked = 0
    `,
    [keyHash]
  );
}

module.exports = {
  generateRawApiKey,
  hashApiKey,
  createApiKeyForCreator,
  revokeApiKey,
  findCreatorByApiKey,
};