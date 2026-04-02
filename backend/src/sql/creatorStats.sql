SELECT
    id,
    creator_id,
    name,
    description,
    current_jackpot,
    status,
    plays,
    income,
    payout,
    profit
FROM creator_stats_view
WHERE creator_id = ?
ORDER BY id DESC;