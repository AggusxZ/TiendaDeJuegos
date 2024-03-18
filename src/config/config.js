const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { commander } = require('../utils/commander');

const { mode } = commander.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
});

exports.configApp = {
  mongoURI:           process.env.MONGO_URI,
  sessionSecret:      process.env.SESSION_SECRET,
  githubClientId:     process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  port:               process.env.PORT,
  gmail_user:         process.env.GMAIL_USER,
  gmail_password:     process.env.GMAIL_PASSWORD,
  app_url:            process.env.APP_URL,
};

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    logger.error('Error al conectar con MongoDB Atlas:', error);
  }
};

