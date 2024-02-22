const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'usuario') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de usuario.' });
    }
  };
  
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); 
    } else {
        res.status(401).json({ error: 'No hay usuario autenticado' });
    }
};

  module.exports = {
    isAdmin,
    isUser,
    isAuthenticated
  };
  