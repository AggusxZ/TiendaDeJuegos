// Middleware para verificar si un usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next(); 
  }
  
  return res.redirect('/auth/login');
};

// Middleware para verificar si un usuario es un administrador
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); 
  }
  
  return res.status(403).json({ error: 'Admin role required' });
};

// Middleware para verificar si un usuario es un usuario normal
const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'usuario') {
      return next(); 
  }
  
  return res.status(403).json({ error: 'User role required' });
};

// Middleware para verificar si un usuario es premium
const isPremium = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'premium') {
    return next(); 
  }
  
  return res.status(403).json({ error: 'Premium role required' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isUser,
  isPremium
};

  