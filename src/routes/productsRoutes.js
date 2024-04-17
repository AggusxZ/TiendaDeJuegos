const express = require('express');
const productsRouter = express.Router();
const productController = require('../controllers/product/productController');
const { isAdmin, isAuthenticated } = require('../middlewares/authorizationMiddleware');

// Ruta para obtener todos los productos (accesible para usuarios autenticados)
productsRouter.get('/', isAuthenticated, (req, res) => {
    const format = req.query.format;
    productController.getProducts(req, res, format);
});

// Ruta para obtener un producto por su ID (accesible para usuarios autenticados)
productsRouter.get('/:pid', isAuthenticated, productController.getProductById);

// Ruta para crear un nuevo producto (solo para administradores)
productsRouter.post('/', isAdmin, productController.addProduct);

// Ruta para actualizar un producto existente (solo para administradores)
productsRouter.put('/:id', isAdmin, productController.updateProduct);

// Ruta para eliminar un producto existente (solo para administradores)
productsRouter.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = productsRouter;



