const User = require('../../models/user.model');
const logger = require('../../utils/logger');
const { sendEmail } = require('../../utils/email');


// Controlador para obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
  try {
      const { uid } = req.params;

      // Verificar si el usuario que realiza la solicitud es un administrador
      if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Unauthorized' });
      }

      // Eliminar al usuario
      const deletedUser = await User.findByIdAndDelete(uid);

      // Verificar si se encontró y eliminó al usuario
      if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controlador para eliminar usuarios inactivos
const deleteInactiveUsers = async (req, res) => {
  try {
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    
    const result = await User.deleteMany({ lastConnection: { $lt: twoDaysAgo } });
    
    
    const deletedUsers = result.deletedCount;
    if (deletedUsers > 0) {
      const emailText = `Hola,\n\nTu cuenta ha sido eliminada debido a inactividad durante más de dos días.\n\nAtentamente,\nEl equipo de Ecommerce`;
      const users = await User.find({ lastConnection: { $lt: twoDaysAgo } }, 'email');
      users.forEach(async user => {
        await sendEmail(user.email, 'Tu cuenta ha sido eliminada por inactividad', emailText);
      });
    }

    res.status(200).json({ message: `${deletedUsers} usuarios eliminados por inactividad` });
  } catch (error) {
    logger.error('Error deleting inactive users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Función para subir documentos
const uploadDocument = async (req, res) => {
  try {
    
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para verificar si el usuario ha cargado todos los documentos requeridos
const checkDocumentsUploaded = async (req, res, next) => {
  try {
    
  } catch (error) {
    console.error('Error al verificar documentos cargados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  uploadDocument,
  checkDocumentsUploaded,
  getUsers,
  deleteInactiveUsers,
  deleteUser
};