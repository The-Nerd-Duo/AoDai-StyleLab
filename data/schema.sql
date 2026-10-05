-- Schema for Cloudflare D1 Database (nếu sử dụng Cloudflare D1)
CREATE TABLE IF NOT EXISTS lookbooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  era TEXT,
  author TEXT,
  authorInitial TEXT,
  isAnonymous INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 1,
  shares INTEGER DEFAULT 0,
  category TEXT DEFAULT 'y2k',
  img TEXT,
  outfit TEXT,
  frameId TEXT,
  culturalNote TEXT,
  createdAt TEXT NOT NULL,
  badge TEXT
);

CREATE INDEX IF NOT EXISTS idx_lookbooks_createdAt ON lookbooks(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_lookbooks_category ON lookbooks(category);
