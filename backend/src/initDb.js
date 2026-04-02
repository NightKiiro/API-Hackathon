const fs = require("fs");
const path = require("path");
const { exec } = require("./db");

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, "sql", "schema.sql"), "utf8");
  const views = fs.readFileSync(path.join(__dirname, "sql", "views.sql"), "utf8");
  const triggers = fs.readFileSync(path.join(__dirname, "sql", "triggers.sql"), "utf8");

  await exec(schema);
  await exec(views);
  await exec(triggers);

  console.log("Database initialized successfully");
}

initDb().catch((err) => {
  console.error(err);
  process.exit(1);
});