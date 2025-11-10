const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartCtrl');

router.use(auth);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

module.exports = router;
