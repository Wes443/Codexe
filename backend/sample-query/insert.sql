-- generate UUID for user and sessison --
SET @u1 = UUID_TO_BIN(UUID());
SET @s1 = UUID_TO_BIN(UUID());

-- focus typing_app db --
USE typing_app;

-- insert data into users db --
INSERT INTO users(user_id, email, username, password_hash, highest_wpm, avg_wpm, total_sessions)
VALUES
    (@u1, 'name@example.com', 'void', SHA2('password1', 256), 100, 80, 5);

-- insert data into sessions db --
INSERT INTO sessions(session_id, user_id, session_type, accuracy, std_wpm, raw_wpm, prog_lang)
VALUES
    (@s1, @u1, 'words 50', 98.45, 90, 92, 'python');
