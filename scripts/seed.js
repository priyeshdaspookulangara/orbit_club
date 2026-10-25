const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'orbit_matrix.db');

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    sponsor_id TEXT,
    parent_id TEXT,
    matrix_level INTEGER NOT NULL DEFAULT 0,
    position INTEGER,
    bfs_sequence INTEGER NOT NULL UNIQUE,
    wallet_balance REAL NOT NULL DEFAULT 0,
    flavor_preference TEXT DEFAULT 'Chocolate',
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
    fulfillment_status TEXT NOT NULL DEFAULT 'Processing',
    tracking_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    source_user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    level_depth INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_user_id) REFERENCES users(id)
  );
`);

const rootPassword = bcrypt.hashSync('Admin@123', 10);

// Check if root ORB00000 exists
const rootUser = db.prepare('SELECT * FROM users WHERE id = ?').get('ORB00000');

if (!rootUser) {
  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, sponsor_id, parent_id, matrix_level, position, bfs_sequence, flavor_preference, shipping_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ORB00000',
    'Orbit System Root',
    'admin@orbitnutrition.com',
    rootPassword,
    'admin',
    null,
    null,
    0, // Level 0
    null,
    1, // Root BFS Sequence 1
    'Chocolate',
    'Orbit Nutrition HQ, Tech Park, Cyber City, India'
  );

  // Initial order for Root Node
  db.prepare(`
    INSERT INTO orders (id, user_id, package_name, amount, flavor, fulfillment_status, tracking_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ORD-ORB00000-INIT',
    'ORB00000',
    '1kg Pure Whey Protein Powder Kit',
    6000,
    'Chocolate',
    'Delivered',
    'ORB-SHIP-0000'
  );

  console.log('Root node ORB00000 created successfully.');
} else {
  console.log('Root node ORB00000 already exists.');
}
