const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');
const User = require('../../models/user.model');
const { logger } = require('../../utils/logger');
const jwt = require('jsonwebtoken');

// Función para mostrar el formulario de registro
const showRegisterForm = (req, res) => {
    res.render('register');
};

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    // Validar los datos del formulario
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer datos del cuerpo de la solicitud
    const { firstName, lastName, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe en la base de datos
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        user = new User({
            firstName,
            lastName,
            email,
            password,
        });

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Guardar el usuario en la base de datos
        await user.save();

        // Redirigir al cliente a la página de inicio de sesión
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Función para mostrar el formulario de inicio de sesión
const showLoginForm = (req, res) => {
    res.render('login');
};

// Función para iniciar sesión
const loginUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        try {
            if (err) { return next(err); }
            if (!user) {
                req.flash('error', 'Credenciales inválidas');
                return res.redirect('/auth/login');
            }
            req.logIn(user, async (err) => {
                if (err) { return next(err); }
                const redirectTo = req.session.returnTo || '/products';
                delete req.session.returnTo;

                // Generar y firmar el token JWT
                const token = jwt.sign({ email: user.email, role: user.role }, 'f6a455cc20c82642fee4a728fec77d7f4fa8859fd5cecdec25cf0feb76864f7', { expiresIn: '1h' });

                // Enviar el token como parte de la respuesta
                res.json({ token, redirectTo });
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    })(req, res, next);
};

// Función para cerrar sesión
const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.redirect('/auth/login');
    });
};

// Función para cambiar rol de un usuario
const updateUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (role !== 'user' && role !== 'premium') {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const updatedUser = await User.findByIdAndUpdate(uid, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        logger.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    showRegisterForm,
    registerUser,
    showLoginForm,
    loginUser,
    logoutUser,
    updateUserRole
};

