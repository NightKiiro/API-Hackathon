SELECT
    id,
    creator_id,
    name,
    description,
    initial_jackpot,
    current_jackpot,
    status,
    plays,
    income,
    payout,
    profit
FROM ranking_view
ORDER BY plays DESC, income DESC, profit DESC, current_jackpot DESC;