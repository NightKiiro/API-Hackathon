INSERT INTO creators (email, api_key)
VALUES
    ('team1@epitech.eu', 'epibet_demo_key_1'),
    ('team2@epitech.eu', 'epibet_demo_key_2');

INSERT INTO games (creator_id, name, description, initial_jackpot, current_jackpot, status)
VALUES
    (1, 'Lucky Dice', 'Jeu de dés rapide', 30, 40, 'active'),
    (2, 'Astro Spin', 'Roue aléatoire', 30, 0, 'closed');

INSERT INTO transactions (game_id, type, amount, jackpot_before, jackpot_after)
VALUES
    (1, 'play',   1, 30, 30),
    (1, 'income', 2, 30, 32),
    (1, 'payout', 5, 32, 27),
    (1, 'income', 13, 27, 40),

    (2, 'play',   1, 30, 30),
    (2, 'income', 2, 30, 32),
    (2, 'payout', 32, 32, 0);

INSERT INTO alerts (game_id, message)
VALUES
    (2, 'Astro Spin has reached 0 jackpot');