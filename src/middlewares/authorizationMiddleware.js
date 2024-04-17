// Middleware para verificar si un usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next(); // Continuar si el usuario está autenticado
  }
  // Devolver un código de estado 401 y un mensaje JSON
  return res.status(401).json({ error: 'Authentication required' });
};

// Middleware para verificar si un usuario es un administrador
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // Continuar si el usuario es un administrador
  }
  // Devolver un código de estado 403 y un mensaje JSON
  return res.status(403).json({ error: 'Admin role required' });
};

// Middleware para verificar si un usuario es un usuario normal
const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'usuario') {
      return next(); // Continuar si el usuario es un usuario normal
  }
  // Devolver un código de estado 403 y un mensaje JSON
  return res.status(403).json({ error: 'User role required' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isUser
};

  