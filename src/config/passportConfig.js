const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../config/config');
const { logger } = require('../utils/logger');

const configurePassport = () => {
    // Serialización y Deserialización
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

    // Estrategia Local
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
    
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
    
                const passwordMatch = await bcrypt.compare(password, user.password);
    
                if (!passwordMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }
    
                logger.info('Inicio de sesión exitoso. Usuario autenticado:', user);
    
                return done(null, user);
            } catch (error) {
                logger.error('Error en la estrategia local:', error);
                return done(error);
            }
        }
    ));

    // Estrategia GitHub
    passport.use(new GitHubStrategy({
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: 'http://localhost:8080/auth/github/callback',
        scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
    
            if (!email) {
                return done(new Error('Correo electrónico no proporcionado por GitHub'));
            }
    
            const user = await User.findOne({ email });
    
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    email,
                    name: profile.displayName,
                });
    
                await newUser.save();
    
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }));
};

module.exports = configurePassport;








