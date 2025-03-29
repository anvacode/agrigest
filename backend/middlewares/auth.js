const jwt = require('jsonwebtoken');
const { HttpError } = require('../utils/errors');

// Verificación temprana de configuración
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET no está definido en las variables de entorno');
  process.exit(1); // Termina la aplicación si no hay JWT_SECRET
}

module.exports = (roles = [], options = {}) => {
  // Opciones configurables
  const { allowExpired = false } = options;

  // Normalización de roles
  if (typeof roles === 'string') {
    roles = [roles];
  }
  roles = roles.map(role => role.toLowerCase());

  return async (req, res, next) => {
    try {
      // 1. Obtención del token desde múltiples fuentes
      const token = (
        req.header('Authorization')?.replace('Bearer ', '') ||
        req.header('x-auth-token') ||
        req.cookies?.token ||
        req.query?.token
      );

      if (!token) {
        throw new HttpError(401, 'Token de autenticación requerido');
      }

      // 2. Verificación del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: allowExpired
      });

      // 3. Validación de la estructura del token
      if (!decoded?.user?.id) {
        throw new HttpError(401, 'Estructura de token inválida');
      }

      // 4. Verificación de roles (si se especificaron)
      if (roles.length > 0) {
        const userRole = decoded.user.role?.toLowerCase();
        if (!userRole || !roles.includes(userRole)) {
          throw new HttpError(403, 'Permisos insuficientes');
        }
      }

      // 5. Adjuntar usuario a la solicitud (sin datos sensibles)
      req.user = {
        id: decoded.user.id,
        role: decoded.user.role,
        ...(decoded.user.farm && { farm: decoded.user.farm })
      };

      // 6. Continuar
      next();
    } catch (error) {
      // Manejo detallado de errores
      switch (error.name) {
        case 'TokenExpiredError':
          error = new HttpError(401, 'Token expirado', {
            expiredAt: error.expiredAt
          });
          break;
        case 'JsonWebTokenError':
          error = new HttpError(401, 
            process.env.NODE_ENV === 'development' 
              ? `Error JWT: ${error.message}`
              : 'Token inválido'
          );
          break;
        case 'NotBeforeError':
          error = new HttpError(401, 'Token no válido aún', {
            date: error.date
          });
          break;
        default:
          if (!(error instanceof HttpError)) {
            error = new HttpError(500, 'Error de autenticación');
          }
      }

      // Log en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Authentication Error:', error);
      }

      next(error);
    }
  };
};