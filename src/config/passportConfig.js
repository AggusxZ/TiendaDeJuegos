const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;









