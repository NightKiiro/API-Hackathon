const whitelist = require("../config/whitelist");

function isEmailAllowed(email) {
  return whitelist.includes(email);
}

module.exports = {
  isEmailAllowed
};