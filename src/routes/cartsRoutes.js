const express = require('express');
const cartsRouter = express.Router();
const cartController = require('../controllers/cart/cartController');
const { isUser } = require('../middlewares/authorizationMiddleware');

// Ruta para mostrar la vista del carrito
cartsRouter.get('/view', isUser, cartController.viewCart);

// Otras rutas del carrito
cartsRouter.post('/', isUser, cartController.createCart);
cartsRouter.get('/product', isUser, cartController.getCartProducts);
cartsRouter.post('/:pid', cartController.addToCart);
cartsRouter.post('/:cid/purchase', cartController.purchaseCart);

module.exports = cartsRouter;




