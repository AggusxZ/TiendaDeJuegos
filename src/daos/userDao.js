const User = require('../models/user.model');
const { logger } = require('../utils/logger');

class UserDAO {
    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            logger.error('Error al obtener el usuario por ID:', error);
            throw error;
        }
    }
}

module.exports = UserDAO;
