const jwt = require('jsonwebtoken');
const { HttpError } = require('../utils/errors');

module.exports = (roles = []) => {
  // Si se pasa un string, convertirlo a array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      // 1. Obtener token del header
      const token = req.header('Authorization')?.replace('Bearer ', '') || 
                   req.header('x-auth-token') || 
                   req.cookies?.token;

      if (!token) {
        throw new HttpError(401, 'Authentication token missing');
      }

      // 2. Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Verificar roles (si se especificaron)
      if (roles.length > 0 && !roles.includes(decoded.user.role)) {
        throw new HttpError(403, 'Insufficient permissions');
      }

      // 4. Adjuntar usuario a la solicitud
      req.user = decoded.user;
      
      // 5. Continuar
      next();
    } catch (error) {
      // Manejar errores específicos de JWT
      if (error.name === 'TokenExpiredError') {
        error = new HttpError(401, 'Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        error = new HttpError(401, 'Invalid token');
      }

      next(error);
    }
  };
};