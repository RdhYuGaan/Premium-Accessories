const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;
async function initDB(){
  if(pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // Optional: verify connection
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('MySQL pool created');
  return pool;
}

function getPool(){ if(!pool) throw new Error('DB not initialized'); return pool; }

module.exports = { initDB, getPool };
