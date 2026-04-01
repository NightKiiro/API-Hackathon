DROP TRIGGER IF EXISTS close_game_when_jackpot_zero;

CREATE TRIGGER close_game_when_jackpot_zero
AFTER UPDATE OF current_jackpot ON games
FOR EACH ROW
WHEN NEW.current_jackpot <= 0 AND OLD.status != 'closed'
BEGIN
    UPDATE games
    SET status = 'closed'
    WHERE id = NEW.id;

    INSERT INTO alerts (game_id, message)
    VALUES (NEW.id, NEW.name || ' has reached 0 jackpot');
END;