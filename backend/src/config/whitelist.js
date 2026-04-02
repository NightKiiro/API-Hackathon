const whitelist = process.env.EPITECH_WHITELIST
  ? process.env.EPITECH_WHITELIST.split(",")
  : [];

const allowedDomains = ["epitech.eu"];

function isEmailAllowed(email) {
  return (
    whitelist.includes(email) ||
    allowedDomains.some(domain => email.endsWith(`@${domain}`))
  );
}

module.exports = {
  whitelist,
  isEmailAllowed
};