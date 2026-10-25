import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'orbit_matrix.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,               -- Unique Distributor ID e.g. ORB00000, ORB00001
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member', -- 'member' | 'admin'
      sponsor_id TEXT,                    -- Who referred this distributor directly
      parent_id TEXT,                     -- Placement parent in the 10-matrix tree
      matrix_level INTEGER NOT NULL DEFAULT 0, -- Level in tree (Root = 0, tier 1-4)
      position INTEGER,                   -- 0-indexed position under parent (0 to 9)
      bfs_sequence INTEGER NOT NULL UNIQUE, -- Global queue sequence number for strict BFS spillover
      wallet_balance REAL NOT NULL DEFAULT 0, -- Total earnings in ₹
      flavor_preference TEXT DEFAULT 'Chocolate', -- 'Chocolate' | 'Vanilla'
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sponsor_id) REFERENCES users(id),
      FOREIGN KEY (parent_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      package_name TEXT NOT NULL DEFAULT '1kg Pure Whey Protein Powder Kit',
      amount REAL NOT NULL DEFAULT 6000,
      flavor TEXT NOT NULL DEFAULT 'Chocolate',
      fulfillment_status TEXT NOT NULL DEFAULT 'Processing', -- 'Processing' | 'Dispatched' | 'Delivered'
      tracking_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,              -- Credited user
      source_user_id TEXT NOT NULL,       -- Distributor whose joining triggered commission
      type TEXT NOT NULL,                 -- 'DIRECT_REFERRAL' | 'MATRIX_LEVEL'
      amount REAL NOT NULL,               -- ₹1,000 for DIRECT_REFERRAL, ₹200 for MATRIX_LEVEL
      level_depth INTEGER,                -- 1, 2, 3, 4, 5 for upline level depth
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (source_user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
    CREATE INDEX IF NOT EXISTS idx_users_sponsor_id ON users(sponsor_id);
    CREATE INDEX IF NOT EXISTS idx_users_bfs_seq ON users(bfs_sequence);
    CREATE INDEX IF NOT EXISTS idx_users_matrix_level ON users(matrix_level);
  `);
}

// Auto initialize schema
initDb();

export default db;
