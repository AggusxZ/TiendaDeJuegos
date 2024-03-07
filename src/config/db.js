const { logger } = require('../utils/logger');

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    logger.error('Error al conectar con MongoDB Atlas:', error);
  }
};

module.exports = connectDB;

