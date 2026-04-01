const fs = require("fs");
const path = require("path");
const db = require("./db");

function readSqlFile(filename) {
  return fs.readFileSync(path.join(__dirname, "sql", filename), "utf8");
}

function initDb(callback) {
  const schema = readSqlFile("schema.sql");
  const views = readSqlFile("views.sql");
  const triggers = readSqlFile("triggers.sql");

  db.exec(schema, (schemaErr) => {
    if (schemaErr) {
      console.error("Schema initialization error:", schemaErr.message);
      if (callback) callback(schemaErr);
      return;
    }

    db.exec(views, (viewsErr) => {
      if (viewsErr) {
        console.error("Views initialization error:", viewsErr.message);
        if (callback) callback(viewsErr);
        return;
      }

      db.exec(triggers, (triggersErr) => {
        if (triggersErr) {
          console.error("Triggers initialization error:", triggersErr.message);
          if (callback) callback(triggersErr);
          return;
        }

        console.log("Database schema, views and triggers initialized");

        if (callback) callback(null);
      });
    });
  });
}

if (require.main === module) {
  initDb(() => db.close());
}

module.exports = initDb;