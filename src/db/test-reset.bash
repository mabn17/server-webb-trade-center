$(> test.copy.sqlite)
cat test-migrate.sql | sqlite3 test.copy.sqlite
