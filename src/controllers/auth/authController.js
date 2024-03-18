const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../../models/user.model');
const { generateResetToken } = require('../../utils/tokens'); 
const { sendPasswordResetEmail } = require('../../utils/email'); 
const { logger } = require('../../utils/logger');

exports.showRegisterForm = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ error: errorMessages[0] }); 
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, role: 'usuario' });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        logger.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.showLoginForm = (req, res) => {
    res.render('login');
};

exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        req.session.user = user;
        
        res.redirect('/products');

    } catch (error) {
        logger.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No hay ningún usuario registrado con este correo electrónico' });
        }

        const resetToken = generateResetToken(user._id);

        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña' });
    } catch (error) {
        logger.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ error: 'El token de restablecimiento de contraseña es inválido o ha expirado' });
        }

        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (newPassword === user.password) {
            return res.status(400).json({ error: 'No puedes usar la misma contraseña anterior' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        logger.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            logger.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.redirect('/auth/login');
    });
};

exports.githubAuth = passport.authenticate('github');

exports.githubAuthCallback = passport.authenticate('github', { 
    failureRedirect: '/',
    successRedirect: '/products'
});

