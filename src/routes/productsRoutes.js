const express = require('express');
const productsRouter = express.Router();
const productController = require('../controllers/product/productController');
const { isAdmin } = require('../middlewares/authorizationMiddleware');


productsRouter.get('/', (req, res) => {
    const format = req.query.format;
    productController.getProducts(req, res, format);
});

productsRouter.get('/:pid', productController.getProductById);

// Ruta para crear un nuevo producto (solo para administradores)
productsRouter.post('/', productController.addProduct);

// Ruta para actualizar un producto existente (solo para administradores)
productsRouter.put('/:id', productController.updateProduct);

// Ruta para eliminar un producto existente (solo para administradores)
productsRouter.delete('/:id', productController.deleteProduct);

module.exports = productsRouter;


