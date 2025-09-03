-- Schema for trade tracker database
CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  qty REAL NOT NULL,
  entry_price REAL NOT NULL,
  entry_time TEXT NOT NULL,
  exit_price REAL,
  exit_time TEXT,
  fees REAL,
  tags TEXT,
  notes TEXT,
  legs TEXT,
  attachment_url TEXT
);
