const fs = require("fs");
const path = require("path");
const { exec } = require("./db");

async function initDb() {
  try {
    const sqlDir = path.join(__dirname, "sql");
    const files = ["schema.sql", "views.sql", "triggers.sql"];

    for (const file of files) {
      const content = fs.readFileSync(path.join(sqlDir, file), "utf8");
      await exec(content);
      console.log(`Loaded ${file}`);
    }

    console.log("Database initialized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

initDb();