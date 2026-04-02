# DB Contract

## Tables

### creators
Stores game creators.

Columns:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `email` TEXT NOT NULL UNIQUE
- `api_key` TEXT NOT NULL UNIQUE
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

---

### games
Stores games created by creators.

Columns:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `creator_id` INTEGER NOT NULL
- `name` TEXT NOT NULL
- `description` TEXT
- `initial_jackpot` INTEGER NOT NULL
- `current_jackpot` INTEGER NOT NULL
- `status` TEXT NOT NULL DEFAULT 'active'
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Rules:
- `initial_jackpot >= 0`
- `current_jackpot >= 0`
- `status IN ('active', 'closed')`

---

### transactions
Stores all game transactions.

Columns:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `game_id` INTEGER NOT NULL
- `type` TEXT NOT NULL
- `amount` INTEGER NOT NULL
- `jackpot_before` INTEGER NOT NULL
- `jackpot_after` INTEGER NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Allowed transaction types:
- `income`
- `payout`
- `play`

Rules:
- `amount >= 0`
- `jackpot_before >= 0`
- `jackpot_after >= 0`

Transaction meaning:
- `income` → money enters the game, jackpot increases
- `payout` → money leaves the game, jackpot decreases
- `play` → one game played, jackpot unchanged unless backend decides otherwise

---

### alerts
Stores public alerts.

Columns:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `game_id` INTEGER NOT NULL
- `message` TEXT NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

---

## Views

### ranking_view
Provides public leaderboard data:
- game name
- jackpot
- status
- plays
- income
- payout
- profit

### creator_stats_view
Provides creator stats per game:
- game name
- jackpot
- status
- plays
- income
- payout
- profit

---

## Trigger

### close_game_when_jackpot_zero
Triggered after update of `games.current_jackpot`.

Behavior:
- if jackpot becomes `0` or less
- sets game status to `closed`
- inserts an alert row

---

## Backend rules to respect

The backend must enforce these rules before inserting data:

1. Do not allow transactions on a closed game
2. Do not allow `payout` greater than current jackpot
3. Every important action must create a transaction
4. `income` increases jackpot
5. `payout` decreases jackpot
6. `play` is used to count played games
7. If jackpot reaches `0`, the game is closed automatically by DB trigger

---

## Useful queries

Available SQL files:
- `ranking.sql`
- `creatorStats.sql`
- `alerts.sql`
- `gameTransactions.sql`

---

## Recommended backend flow for a transaction

1. Read game by `game_id`
2. Check game exists
3. Check game is not closed
4. Compute `jackpot_after`
5. Reject if invalid payout
6. Insert transaction
7. Update `games.current_jackpot`
8. Let DB trigger close game and create alert if jackpot reaches `0`