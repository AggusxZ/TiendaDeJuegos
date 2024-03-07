const UserDAO = require('../daos/userDao');
const { logger } = require('../utils/logger');

class UserRepository {
  async getUserById(id) {
    try {
      return await UserDAO.getUserById(id);
    } catch (error) {
      logger.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
