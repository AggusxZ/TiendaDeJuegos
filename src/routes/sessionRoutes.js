const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authorizationMiddleware');
const { logger } = require('../utils/logger');

const UserDAO = require('../daos/userDao');
const UserDTO = require('../dtos/userDto');

const userDAO = new UserDAO();

// Ruta para obtener la información del usuario actual
router.get('/current', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const currentUser = await userDAO.getUserById(userId);

        const userDTO = new UserDTO(currentUser.email, currentUser.role);

        res.json({ user: userDTO });
    } catch (error) {
        logger.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;




