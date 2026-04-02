const { findCreatorByApiKey } = require("../services/apiKeyService");

async function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.header("X-API-Key");

    if (!apiKey) {
      return res.status(401).json({
        error: "Missing API key",
      });
    }

    const creator = await findCreatorByApiKey(apiKey);

    if (!creator) {
      return res.status(401).json({
        error: "Invalid or revoked API key",
      });
    }

    req.user = {
      id: creator.creator_id,
      email: creator.email,
      apiKeyId: creator.api_key_id,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = apiKeyMiddleware;