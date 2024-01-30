const express = require('express');
const cartsRouter = express.Router();
const cartController = require('../controllers/cart/cartController');

cartsRouter.post('/', cartController.createCart);
cartsRouter.get('/', cartController.getCartProducts);
cartsRouter.post('/:pid', cartController.addToCart);

module.exports = cartsRouter;


