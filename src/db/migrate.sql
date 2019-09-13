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
    picture VARCHAR(400) NOT NULL,
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

INSERT INTO users(password, email, assets, first_name, last_name)
VALUES
    ("$2b$10$bZJ3FkvTP9qCZ7dOQHqYNeCggc27iMpOTfCaFjGirLwZ7VEPLqmPG", "martin.d@live.se", 1000.0, "Martin", "Borg");

INSERT INTO items(name, description, picture, price)
VALUES
    ("Gold", "Some gold", "https://www.goodreturns.in/img/2019/08/gold-1565419690.jpg", 100.65),
    ("Silver", "Shiny silver", "https://static2.proactiveinvestors.co.uk/thumbs/upload/News/Image/2019_08/672z311_1567003954_shutterstock_256676086.jpg", 106.65),
    ("Copper", "Our finest copper", "https://ak8.picdn.net/shutterstock/videos/34795558/thumb/1.jpg", 10000.65),
    ("Palladium", "No idea what this is.", "https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/r-tPTIvHGjcujl71k/videoblocks-palladium-bars-background-animation-3d-rendering_rzuckvpsg_thumbnail-full01.png", 49.65),
    ("Rhenium", "A rare mineral", "https://www.refractorymetal.org/wp-content/uploads/2018/01/pure-Rhenium.jpg", 106),
    ("Osmium", "One of the heviest minerals on earth", "https://images.bonnier.cloud/files/ill/production/2018/10/14001131/osmium.jpg", 420.69),
    ("Mercury", "Its deadly", "https://www.thebalance.com/thmb/xBwp2veZA_1i1fas8GH1ioSViCg=/3042x2282/smart/filters:no_upscale()/quicksilver-93292637-b2eb7c7902e04e93b371b22a06d099f5.jpg", 106)
;

INSERT INTO user_stocks(item_name, amount, buyer_id, buy_in_price)
VALUES
    ("Gold", 20, 1, 100.65),
    ("Silver", 10, 1, 106.65),
    ("Mercury", 4, 1 , 106);
