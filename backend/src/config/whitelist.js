require("dotenv").config();

function getExplicitWhitelist() {
  const raw = process.env.WHITELIST_EMAILS || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function isEpitechEmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith("@epitech.eu");
}

function isEmailAllowed(email) {
  if (!email || typeof email !== "string") return false;

  const normalized = email.trim().toLowerCase();
  const whitelist = getExplicitWhitelist();

  return isEpitechEmail(normalized) || whitelist.includes(normalized);
}

module.exports = {
  isEmailAllowed,
  isEpitechEmail,
  getExplicitWhitelist,
};