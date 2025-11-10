const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

async function register(req, res){
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if(!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email' });
  if(!isStrongPassword(password)) return res.status(400).json({ error: 'Password too weak' });

  const pool = getPool();
  const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if(exists.length) return res.status(400).json({ error: 'Email in use' });

  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name,email,hashed]);
  const userId = result.insertId;
  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token, user: { id: userId, name, email } });
}

async function login(req,res){
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const pool = getPool();
  const [rows] = await pool.query('SELECT id,name,email,password FROM users WHERE email = ?', [email]);
  if(!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if(!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

module.exports = { register, login };
