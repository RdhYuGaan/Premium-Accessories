const { getPool } = require('../config/db');

// We'll store cart items in a cart_items table associated with a user_id
async function getCart(req,res){
  const userId = req.user.id;
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT ci.id,ci.quantity,p.id product_id,p.name,p.price,p.thumbnail
     FROM cart_items ci JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`, [userId]
  );
  res.json({ items: rows });
}

async function addToCart(req,res){
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body;
  if(!product_id) return res.status(400).json({ error: 'Missing product_id' });
  const pool = getPool();
  // if exists, increment
  const [existing] = await pool.query('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, product_id]);
  if(existing.length){
    const newQty = existing[0].quantity + quantity;
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
  } else {
    await pool.query('INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?,?,?)', [userId, product_id, quantity]);
  }
  res.json({ ok: true });
}

async function updateCartItem(req,res){
  const userId = req.user.id;
  const { id } = req.params; // cart item id
  const { quantity } = req.body;
  if(quantity == null) return res.status(400).json({ error: 'Missing quantity' });
  const pool = getPool();
  await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, userId]);
  res.json({ ok: true });
}

async function removeCartItem(req,res){
  const userId = req.user.id;
  const { id } = req.params;
  const pool = getPool();
  await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
  res.json({ ok: true });
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
