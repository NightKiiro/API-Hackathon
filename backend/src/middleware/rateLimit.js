const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5000, // 200 requêtes par IP sur la fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many auth requests, please try again later.",
  },
});

const transactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many transaction requests, please try again later.",
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  transactionLimiter,
};