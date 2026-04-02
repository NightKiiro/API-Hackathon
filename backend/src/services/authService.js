const { isEmailAllowed } = require("../config/whitelist");

function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function canRegisterEmail(email) {
  console.log("RAW EMAIL:", email);

  const isValid = validateEmail(email);
  console.log("VALID EMAIL:", isValid);

  const allowed = isEmailAllowed(email);
  console.log("ALLOWED EMAIL:", allowed);

  if (!isValid) {
    return {
      ok: false,
      error: "Invalid email format",
    };
  }

  if (!allowed) {
    return {
      ok: false,
      error: "Email is not allowed",
    };
  }

  return { ok: true };
}

module.exports = {
  validateEmail,
  normalizeEmail,
  canRegisterEmail,
};