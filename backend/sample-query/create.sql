-- focus typing_app db --
USE typing_app;

-- create users table --
CREATE TABLE users (
    user_id BINARY(16) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL UNIQUE,
    highest_wpm INT,
    avg_wpm INT,
    total_sessions INT
);

-- create sessions table --
CREATE TABLE sessions (
    session_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16),
    session_type VARCHAR(50) NOT NULL,
    accuracy DECIMAL(5,2),
    std_wpm INT,
    raw_wpm INT,
    prog_lang VARCHAR(50),
    data_achieved DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_user_date (user_id, date_achieved)
)
