SELECT
    t.id,
    t.game_id,
    g.name AS game_name,
    t.type,
    t.amount,
    t.jackpot_before,
    t.jackpot_after,
    t.created_at
FROM transactions t
JOIN games g ON t.game_id = g.id
WHERE t.game_id = ?
ORDER BY t.created_at DESC, t.id DESC;