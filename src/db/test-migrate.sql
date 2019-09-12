CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    assets REAL DEFAULT 0.0,
    first_name VARCHAR(60),
    last_name VARCHAR(60),

    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(255) NOT NULL,
    pricture VARCHAR(400) NOT NULL,
    price REAL DEFAULT 0.0,

    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS user_stocks (
    id INTEGER PRIMARY KEY,
    item_name VARCHAR(60),
    amount INTEGER DEFAULT 0,
    buyer_id INTEGER NOT NULL,
    buy_in_price REAL DEFAULT 0.0,
    buy_in_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_log (
    id INTEGER PRIMARY KEY,
    item_name VARCHAR(60) NOT NULL,
    when_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    old_price REAL DEFAULT 0.0
);

CREATE TRIGGER IF NOT EXISTS price_update AFTER UPDATE ON items
BEGIN
    INSERT INTO price_log(item_name, old_price)
        VALUES(OLD.name, OLD.price);
END;

INSERT INTO items(name, description, pricture, price)
VALUES ("Gold", "Some gold", "https://www.goodreturns.in/img/2019/08/gold-1565419690.jpg", 5.65);