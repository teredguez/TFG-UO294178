function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: 'No autenticado.' });
}

function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    error: 'Acceso denegado. Requiere permisos de administrador.',
  });
}

module.exports = {
  requireAuth,
  requireAdmin,
};