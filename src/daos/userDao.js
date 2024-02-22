const User = require('../models/user.model');

class UserDAO {
    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            console.error('Error al obtener el usuario por ID:', error);
            throw error;
        }
    }
}

module.exports = UserDAO;
