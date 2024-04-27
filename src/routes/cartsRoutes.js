const express = require('express');
const cartsRouter = express.Router();
const cartController = require('../controllers/cart/cartController');

// Ruta para mostrar la vista del carrito con el ID del carrito como parámetro
cartsRouter.get('/view/:cartId', cartController.viewCart);

// Ruta para obtener los productos del carrito
cartsRouter.get('/:cartId/products', cartController.getCartProducts);

// Ruta para comprar los productos del carrito
cartsRouter.post('/purchase/:cid', cartController.purchaseCart);

// Ruta para añadir un producto al carrito
cartsRouter.post('/:cid/:pid', cartController.addToCart);

// Ruta para crear un nuevo carrito
cartsRouter.post('/', cartController.createCart);


module.exports = cartsRouter;







