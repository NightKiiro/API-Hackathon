const db = require("../db");
const { isEmailAllowed } = require("../config/whitelist");

function createUser(email) {
  return new Promise((resolve, reject) => {
    if (!isEmailAllowed(email)) {
      return reject(new Error("Email non autorisé"));
    }

    db.run(
      "INSERT INTO creators (email) VALUES (?)",
      [email],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, email });
      }
    );
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM creators WHERE email = ?",
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

module.exports = {
  createUser,
  getUserByEmail
};