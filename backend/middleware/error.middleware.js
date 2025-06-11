const { HttpError } = require('../utils/errors');

const errorMiddleware = (err, req, res, next) => {
  console.error(err.message || 'Error desconocido');
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = errorMiddleware; 