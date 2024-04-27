const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user.model');
const { generateResetToken } = require('../../utils/tokens');
const { sendPasswordResetEmail } = require('../../utils/email');
const { logger } = require('../../utils/logger');

// Función para solicitar restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
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

// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
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

module.exports = {
    requestPasswordReset,
    resetPassword
};



