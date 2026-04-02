DROP VIEW IF EXISTS ranking_view;
CREATE VIEW ranking_view AS
SELECT
    g.id,
    g.name,
    g.description,
    g.current_jackpot,
    g.status,
    g.created_at,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS total_payout,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS net_revenue,
    COUNT(t.id) AS total_transactions
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
    g.initial_jackpot,
    g.current_jackpot,
    g.status,
    g.created_at,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS total_payout,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payout' THEN t.amount ELSE 0 END), 0) AS net_revenue,
    COUNT(t.id) AS total_transactions
FROM games g
LEFT JOIN transactions t ON g.id = t.game_id
GROUP BY g.id;