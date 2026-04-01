const whitelist = process.env.EPITECH_WHITELIST
  ? process.env.EPITECH_WHITELIST.split(",")
  : [];

module.exports = whitelist;