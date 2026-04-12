function errorMiddleware(err, req, res, next) {
  console.error('Error no controlado:', err);

  return res.status(500).json({
    error: 'Error interno del servidor.',
  });
}

module.exports = errorMiddleware;