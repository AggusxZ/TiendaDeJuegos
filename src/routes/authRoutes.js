const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser, githubAuth, githubAuthCallback } = require('../controllers/auth/authController');
const { requestPasswordReset, resetPassword } = require('../controllers/auth/passwordResetController');
const jwt = require('jsonwebtoken');
const { generateResetToken } = require('../utils/tokens');

// Rutas de autenticación
router.get('/register', showRegisterForm);
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
], registerUser);

router.get('/login', showLoginForm);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Rutas de restablecimiento de contraseña
router.post('/password/reset/request', [
    body('email').isEmail().normalizeEmail(),
], requestPasswordReset);

router.get('/password/reset/request', (req, res) => {
    res.render('password_reset_request');
});

router.post('/password/reset', [
    body('token').not().isEmpty(),
    body('newPassword').isLength({ min: 6 }),
], resetPassword);

router.get('/password/reset', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ error: 'Se requiere un token para restablecer la contraseña' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: 'El token de restablecimiento de contraseña es inválido o ha expirado' });
        }
        
        res.render('password_reset_form', { token });
    });
});

// Rutas de autenticación de GitHub
router.get('/github', githubAuth);
router.get('/github/callback', githubAuthCallback);

module.exports = router;







