<?php
// database/init.php
require_once __DIR__ . '/../config/database.php';

function initDatabase() {
    $pdo = Database::getConnection();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    if ($driver === 'mysql') {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(32) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('member', 'admin') NOT NULL DEFAULT 'member',
                sponsor_id VARCHAR(32) NULL,
                parent_id VARCHAR(32) NULL,
                position INT NOT NULL DEFAULT 0,
                matrix_level INT NOT NULL DEFAULT 0,
                bfs_sequence INT UNIQUE NOT NULL,
                flavor_preference VARCHAR(50) NOT NULL DEFAULT 'Chocolate',
                shipping_address TEXT NOT NULL,
                wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_parent (parent_id),
                INDEX idx_sponsor (sponsor_id),
                INDEX idx_bfs (bfs_sequence)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(64) PRIMARY KEY,
                user_id VARCHAR(32) NOT NULL,
                package_name VARCHAR(255) NOT NULL DEFAULT '1kg Pure Whey Protein Powder Kit',
                amount DECIMAL(10,2) NOT NULL DEFAULT 6000.00,
                flavor VARCHAR(50) NOT NULL DEFAULT 'Chocolate',
                fulfillment_status ENUM('Processing', 'Dispatched', 'Delivered') NOT NULL DEFAULT 'Processing',
                tracking_number VARCHAR(100) NULL,
                shipping_address TEXT NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_order_user (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS transactions (
                id VARCHAR(64) PRIMARY KEY,
                user_id VARCHAR(32) NOT NULL,
                type ENUM('DIRECT_REFERRAL', 'MATRIX_LEVEL', 'WITHDRAWAL') NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                source_user_id VARCHAR(32) NULL,
                level_depth INT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_tx_user (user_id),
                INDEX idx_tx_type (type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    } else {
        // SQLite dialect
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'member',
                sponsor_id TEXT NULL,
                parent_id TEXT NULL,
                position INTEGER NOT NULL DEFAULT 0,
                matrix_level INTEGER NOT NULL DEFAULT 0,
                bfs_sequence INTEGER UNIQUE NOT NULL,
                flavor_preference TEXT NOT NULL DEFAULT 'Chocolate',
                shipping_address TEXT NOT NULL,
                wallet_balance REAL NOT NULL DEFAULT 0.00,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                package_name TEXT NOT NULL DEFAULT '1kg Pure Whey Protein Powder Kit',
                amount REAL NOT NULL DEFAULT 6000.00,
                flavor TEXT NOT NULL DEFAULT 'Chocolate',
                fulfillment_status TEXT NOT NULL DEFAULT 'Processing',
                tracking_number TEXT NULL,
                shipping_address TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                type TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT NOT NULL,
                source_user_id TEXT NULL,
                level_depth INTEGER NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        ");
    }

    // Seed Root Admin Node ORB00000 if missing
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = 'ORB00000'");
    $stmt->execute();
    if ((int)$stmt->fetchColumn() === 0) {
        $rootHash = password_hash('Admin@123', PASSWORD_BCRYPT);
        $pdo->prepare("
            INSERT INTO users (
                id, name, email, phone, password_hash, role, sponsor_id, parent_id,
                position, matrix_level, bfs_sequence, flavor_preference, shipping_address, wallet_balance
            ) VALUES (
                'ORB00000', 'Orbit System Root', 'admin@orbitnutrition.com', '+91 98765 43210',
                ?, 'admin', NULL, NULL, 0, 0, 1, 'Chocolate', 'Orbit Nutrition HQ, Tech Park, India', 0.00
            )
        ")->execute([$rootHash]);

        // Create Root Order
        $pdo->prepare("
            INSERT INTO orders (id, user_id, package_name, amount, flavor, fulfillment_status, tracking_number, shipping_address)
            VALUES ('ORD-ORB00000-INIT', 'ORB00000', '1kg Pure Whey Protein Powder Kit', 6000.00, 'Chocolate', 'Delivered', 'ORB-SHIP-0000', 'Orbit Nutrition HQ, Tech Park, India')
        ")->execute();
    }
}

initDatabase();
