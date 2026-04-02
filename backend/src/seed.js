// pour faire les tests, il faut d'abord lancer ce fichier pour remplir la base de données avec les données de seed.sql
const fs = require("fs");
const path = require("path");
const db = require("./db");

function seed() {
  const seedPath = path.join(__dirname, "sql", "seed.sql");
  const seedSQL = fs.readFileSync(seedPath, "utf8");

  db.exec(seedSQL, (err) => {
    if (err) {
      console.error("Seed error:", err.message);
    } else {
      console.log("Database seeded successfully");
    }

    db.close();
  });
}

seed();