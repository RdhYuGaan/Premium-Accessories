const { getPool } = require('../config/db');

async function listProducts(req,res){
  const pool = getPool();
  const [rows] = await pool.query('SELECT id,name,category,price,thumbnail,description,stock FROM products ORDER BY id DESC');
  res.json({ products: rows });
}

async function getProduct(req,res){
  const { id } = req.params;
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  if(!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json({ product: rows[0] });
}

module.exports = { listProducts, getProduct };
