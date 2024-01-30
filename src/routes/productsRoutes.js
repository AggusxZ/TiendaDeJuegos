const express = require('express');
const productsRouter = express.Router();
const productController = require('../controllers/product/productController');

const { renderProductsView } = require('../controllers/product/productController');

productsRouter.get('/', renderProductsView);

productsRouter.get('/:pid', productController.getProductById);
productsRouter.post('/', productController.addProduct);

module.exports = productsRouter;


