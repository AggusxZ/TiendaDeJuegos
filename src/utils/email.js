const nodemailer = require('nodemailer');
const { configApp } = require('../config/config');
const { logger } = require('../utils/logger');

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configApp.gmail_user,
      pass: configApp.gmail_password,
    },
  });

  const resetLink = `${configApp.app_url}/auth/password-reset/${resetToken}`;

  const mailOptions = {
    from: configApp.gmail_user,
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><p><a href="${resetLink}">Restablecer contraseña</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
};

module.exports = {
  sendPasswordResetEmail,
};
