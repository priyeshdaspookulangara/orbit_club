import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Environment parameters for MySQL connection
const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const MYSQL_PORT = Number(process.env.MYSQL_PORT) || 3306;
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'orbit_nutrition';

let pool: mysql.Pool | null = null;
let useMysql = false;
let sqliteDb: any = null;

function getSqliteDb() {
  if (!sqliteDb) {
    const dbPath = path.join(process.cwd(), 'data', 'orbit_matrix.db');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');

    sqliteDb.exec(`
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
  }
  return sqliteDb;
}

export async function initDb() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 500,
      });
    }

    const conn = await pool.getConnection();
    await conn.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        package_name VARCHAR(255) NOT NULL DEFAULT '1kg Pure Whey Protein Powder Kit',
        amount DECIMAL(12,2) NOT NULL DEFAULT 6000.00,
        flavor VARCHAR(50) NOT NULL DEFAULT 'Chocolate',
        fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
        tracking_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        source_user_id VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        level_depth INT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conn.release();
    useMysql = true;
    return true;
  } catch (err) {
    useMysql = false;
    getSqliteDb();
    return false;
  }
}

/**
 * Executes a parameterized query returning array of rows
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (useMysql && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (e) {
      useMysql = false;
    }
  }

  const sdb = getSqliteDb();
  const stmt = sdb.prepare(sql);
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    return stmt.all(...params) as T[];
  } else {
    const res = stmt.run(...params);
    return res as any;
  }
}

/**
 * Executes a single row query
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const rows = await query<T>(sql, params);
  return rows[0];
}

/**
 * Executes an atomic transaction callback
 */
export async function withTransaction<T>(callback: (conn: any) => Promise<T>): Promise<T> {
  if (useMysql && pool) {
    let conn: mysql.PoolConnection | null = null;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      const txAdapter = {
        query: async (sql: string, params: any[] = []) => {
          const [r] = await conn!.query(sql, params);
          return r;
        },
        queryOne: async (sql: string, params: any[] = []) => {
          const [r] = await conn!.query(sql, params);
          return (r as any[])[0];
        }
      };
      const result = await callback(txAdapter);
      await conn.commit();
      return result;
    } catch (err) {
      if (conn) await conn.rollback();
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  const sdb = getSqliteDb();
  const txAdapter = {
    query: async (sql: string, params: any[] = []) => {
      const stmt = sdb.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(...params);
      }
      return stmt.run(...params);
    },
    queryOne: async (sql: string, params: any[] = []) => {
      const stmt = sdb.prepare(sql);
      return stmt.get(...params);
    }
  };

  return await callback(txAdapter);
}

export default {
  initDb,
  query,
  queryOne,
  withTransaction
};
