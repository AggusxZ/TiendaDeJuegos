const User = require('../models/user.model');
const { logger } = require('../utils/logger');

class UserRepository {
  async getUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
      return updatedUser;
    } catch (error) {
      logger.error('Error al actualizar el rol del usuario:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();

