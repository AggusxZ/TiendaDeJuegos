const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser } = require('../controllers/auth/authController');
const passport = require('passport');
const { isAuthenticated, isAdmin, isUser } = require('../middlewares/authorizationMiddleware');

// Mostrar formulario de registro
router.get('/register', showRegisterForm);

// Procesar datos de registro
router.post('/register', [
    body('firstName').notEmpty().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], registerUser);

// Mostrar formulario de inicio de sesión
router.get('/login', showLoginForm);

// Procesar datos de inicio de sesión utilizando la función loginUser
router.post('/login', loginUser);

// Cerrar sesión
router.get('/logout', logoutUser);
router.post('/logout', logoutUser);

// Ejemplo de ruta protegida que requiere autenticación
router.get('/profile', isAuthenticated, (req, res) => {
    res.send('Perfil del usuario');
});

// Ejemplo de ruta protegida que requiere permisos de administrador
router.get('/admin', isAdmin, (req, res) => {
    res.send('Panel de administración');
});

// Ejemplo de ruta protegida que requiere permisos de usuario
router.get('/user', isUser, (req, res) => {
    res.send('Panel de usuario');
});

module.exports = router;











