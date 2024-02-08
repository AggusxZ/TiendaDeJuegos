const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar con MongoDB Atlas:', error);
  }
};

module.exports = connectDB;
