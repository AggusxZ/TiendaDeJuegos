const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://AggusxZ:oEirPMQPY7HUfo2k@cluster0.46mdk2n.mongodb.net/tiendadejuegos';

    await mongoose.connect(uri);

    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar con MongoDB Atlas:', error);
  }
};

module.exports = connectDB;