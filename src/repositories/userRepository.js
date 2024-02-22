const UserDAO = require('../daos/userDao');

class UserRepository {
  async getUserById(id) {
    try {
      return await UserDAO.getUserById(id);
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
