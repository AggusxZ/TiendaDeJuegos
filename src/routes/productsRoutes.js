const express = require('express');
const productsRouter = express.Router();
const productController = require('../controllers/product/productController');
const { isAuthenticated } = require('../middlewares/authorizationMiddleware');

// Middleware para verificar si el usuario es administrador o premium
const isAdminOrPremium = (req, res, next) => {
    
    if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next();
    } else {
        return res.status(403).json({ error: 'Admin or Premium role required' });
    }
};

// Ruta para obtener todos los productos (accesible para usuarios autenticados)
productsRouter.get('/', isAuthenticated, (req, res) => {
    const format = req.query.format;
    productController.getProducts(req, res, format);
});

// Ruta para obtener un producto por su ID (accesible para usuarios autenticados)
productsRouter.get('/:pid', isAuthenticated, productController.getProductById);

// Ruta para crear un nuevo producto (solo para administradores y usuarios premium)
productsRouter.post('/', isAdminOrPremium, productController.addProduct);

// Ruta para actualizar un producto existente (solo para administradores y usuarios premium)
productsRouter.put('/:id', isAdminOrPremium, productController.updateProduct);

// Ruta para eliminar un producto existente (solo para administradores o usuarios premium)
productsRouter.delete('/:id', isAdminOrPremium, productController.deleteProduct);

module.exports = productsRouter;





