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

CREATE UNIQUE INDEX user_stock_index ON user_stocks(item_name, buyer_id);

CREATE TABLE IF NOT EXISTS price_log (
    id INTEGER PRIMARY KEY,
    item_name VARCHAR(60) NOT NULL,
    when_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    old_price REAL DEFAULT 0.0
);

-- TO sell user stocks
CREATE TRIGGER IF NOT EXISTS sell_stocks AFTER UPDATE ON user_stocks
WHEN Old.amount > NEW.amount
BEGIN
    UPDATE users SET
        assets =
            ((SELECT assets FROM users WHERE id = OLD.buyer_id) +
            ((SELECT price FROM items WHERE name = OLD.item_name) * (OLD.amount - NEW.amount)))
    WHERE id = OLD.buyer_id;
END;

-- TO Buy user stocks
CREATE TRIGGER IF NOT EXISTS buy_stocks AFTER UPDATE ON user_stocks
WHEN NEW.amount > OLD.amount
BEGIN
    UPDATE users SET
        assets =
            ((SELECT assets FROM users WHERE id = OLD.buyer_id) -
            ((SELECT price FROM items WHERE name = OLD.item_name) * (NEW.amount - OLD.amount)))
    WHERE id = OLD.buyer_id;
END;

-- TO UPDATE Old prices
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
    ("Gold", "Nearly all of the gold on Earth came from meteorites that bombarded the planet over 200 million years after it formed.", "Gold.jpg", 100.65),
    ("Silver", "Silver metal is not toxic to humans. In fact, it can be used as a food decoration. However, most silver salts are toxic. Silver is germicidal, meaning it kills bacteria and other lower organisms.", "Silver.jpg", 106.85),
    ("Copper", "Copper is an essential element for human nutrition. The mineral is critical for blood cell formation and is found in many foods and most water supplies. Foods high in copper include leafy greens, grains, potatoes, and beans. Although it takes a lot of copper, it's possible to get too much. Excess copper can cause jaundice, anemia, and diarrhea (which may be blue!).", "Copper.jpg", 98.25),
    ("Palladium", "At one time, palladium was used as an early treatment for tuberculosis, but its harmful side effects led to better treatment alternatives.", "Palladium.jpg", 49.65),
    ("Rhenium", "Rhenium was the last element to be discovered that had a stable isotope; other elements have been discovered since that time, but they are radioactive.", "Rhenium.jpg", 106),
    ("Osmium", "While most elements aren't know for the way they smell, osmium emits a characteristic unpleasant smell. The element and its compounds are highly toxic.", "Osmium.jpg", 130.69),
    ("Mercury", "The element Mercury is named for the Roman god Mercury. Mercury is the only element to retain its alchemical name as its modern common name. The element was known to ancient civilizations, dating back to at least 2000 BCE Vials of pure mercury have been found in Egyptian tombs from the 1500s BCE.", "Mercury.jpg", 106)
;

INSERT INTO user_stocks(item_name, amount, buyer_id, buy_in_price)
VALUES
    ("Gold", 20, 1, 100.65),
    ("Silver", 10, 1, 106.65),
    ("Mercury", 4, 1 , 106);

CREATE TRIGGER IF NOT EXISTS buy_new_stocks AFTER INSERT ON user_stocks
BEGIN
    UPDATE users SET
        assets =
            ((SELECT assets FROM users WHERE id = NEW.buyer_id) -
            ((SELECT price FROM items WHERE name = NEW.item_name) * NEW.amount))
    WHERE id = NEW.buyer_id;
END;