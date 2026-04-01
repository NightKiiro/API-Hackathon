SELECT
    a.id,
    a.message,
    a.created_at,
    g.id AS game_id,
    g.name AS game_name,
    g.status,
    g.current_jackpot
FROM alerts a
JOIN games g ON a.game_id = g.id
ORDER BY a.created_at DESC;