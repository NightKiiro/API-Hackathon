const fs = require("fs");
const path = require("path");
const db = require("./db");

function readSqlFile(filename) {
  const filePath = path.join(__dirname, "sql", filename);
  return fs.readFileSync(filePath, "utf8");
}

function runQuery(label, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(`${label} error:`, err.message);
        reject(err);
      } else {
        console.log(`\n=== ${label} ===`);
        console.table(rows);
        resolve(rows);
      }
    });
  });
}

async function testQueries() {
  try {
    const rankingSql = readSqlFile("ranking.sql");
    const creatorStatsSql = readSqlFile("creatorStats.sql");
    const alertsSql = readSqlFile("alerts.sql");
    const gameTransactionsSql = readSqlFile("gameTransactions.sql");

    await runQuery("Ranking", rankingSql);
    await runQuery("Creator Stats (creator_id = 1)", creatorStatsSql, [1]);
    await runQuery("Alerts", alertsSql);
    await runQuery("Game Transactions (game_id = 1)", gameTransactionsSql, [1]);

    console.log("\nAll queries executed successfully");
  } catch (error) {
    console.error("\nTest queries failed");
  } finally {
    db.close();
  }
}

testQueries();