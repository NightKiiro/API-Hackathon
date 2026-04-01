DROP VIEW IF EXISTS ranking_view;

CREATE VIEW ranking_view AS
SELECT
    g.id,
    g.creator_id,
    g.name,
    g.description,
    g.initial_jackpot,
    g.current_jackpot,
    g.status,
    COUNT(CASE WHEN t.type = 'play' THEN 1 END) AS plays,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS payout,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS profit
FROM games g
LEFT JOIN transactions t ON g.id = t.game_id
GROUP BY g.id;

DROP VIEW IF EXISTS creator_stats_view;

CREATE VIEW creator_stats_view AS
SELECT
    g.id,
    g.creator_id,
    g.name,
    g.description,
    g.current_jackpot,
    g.status,
    COUNT(CASE WHEN t.type = 'play' THEN 1 END) AS plays,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS payout,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS profit
FROM games g
LEFT JOIN transactions t ON g.id = t.game_id
GROUP BY g.id;