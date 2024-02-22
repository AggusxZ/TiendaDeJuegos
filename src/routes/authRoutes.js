const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const authController = require('../controllers/auth/authController');
const router = express.Router();

router.get('/register', authController.showRegisterForm);

router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], authController.registerUser);

router.get('/login', authController.showLoginForm);

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], 
passport.authenticate('local'), 
authController.loginUser);


router.post('/logout', authController.logoutUser);

router.get('/github', authController.githubAuth);

router.get('/github/callback', authController.githubAuthCallback);

module.exports = router;






