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
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    sponsor_id VARCHAR(50),
    parent_id VARCHAR(50),
    matrix_level INT NOT NULL DEFAULT 0,
    position INT,
    bfs_sequence INT NOT NULL UNIQUE,
    wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    flavor_preference VARCHAR(50) DEFAULT 'Chocolate',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    package_name VARCHAR(255) NOT NULL DEFAULT '1kg Pure Whey Protein Powder Kit',
    amount DECIMAL(12,2) NOT NULL DEFAULT 6000.00,
    flavor VARCHAR(50) NOT NULL DEFAULT 'Chocolate',
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
    tracking_number VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    source_user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    level_depth INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
