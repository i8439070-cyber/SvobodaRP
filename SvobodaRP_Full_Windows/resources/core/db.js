import mysql from 'mysql2/promise';
import fs from 'fs';

let pool;

export async function initDB(cfgPath = 'resources/core/config.json') {
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  pool = mysql.createPool({
    host: cfg.db.host,
    user: cfg.db.user,
    password: cfg.db.password,
    database: cfg.db.database,
    port: cfg.db.port,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });
  return pool;
}

export function getDB() {
  if (!pool) throw new Error('DB pool not initialized. Call initDB() first.');
  return pool;
}