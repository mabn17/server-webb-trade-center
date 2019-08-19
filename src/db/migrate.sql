CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    assets REAL DEFAULT 0.0,
    UNIQUE(email)
);
