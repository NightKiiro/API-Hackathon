PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS creators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    api_key TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    initial_jackpot INTEGER NOT NULL CHECK(initial_jackpot >= 0),
    current_jackpot INTEGER NOT NULL CHECK(current_jackpot >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'payout', 'play')),
    amount INTEGER NOT NULL CHECK(amount >= 0),
    jackpot_before INTEGER NOT NULL CHECK(jackpot_before >= 0),
    jackpot_after INTEGER NOT NULL CHECK(jackpot_after >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_games_creator_id
ON games (creator_id);

CREATE INDEX IF NOT EXISTS idx_transactions_game_id
ON transactions (game_id);

CREATE INDEX IF NOT EXISTS idx_transactions_type
ON transactions (type);

CREATE INDEX IF NOT EXISTS idx_alerts_game_id
ON alerts (game_id);