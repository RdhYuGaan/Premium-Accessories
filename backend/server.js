require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./src/config/db');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');

const app = express();
app.use(cors());
app.use(express.json());

initDB(); // establish DB pool

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
