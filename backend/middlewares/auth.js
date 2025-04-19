const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HttpError } = require('../utils/errors');

// Verificar que la variable de entorno JWT_SECRET esté configurada
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET no está definido en las variables de entorno');
  process.exit(1);
}

module.exports = (roles = [], options = {}) => {
  const { allowExpired = false } = options;

  // Asegurarse de que roles sea un array
  if (typeof roles === 'string') {
    roles = [roles];
  }
  roles = roles.map((role) => role.toLowerCase());

  return async (req, res, next) => {
    try {
      // Obtener el token del encabezado Authorization
      const token = req.header('Authorization')?.replace('Bearer ', '');
      console.log('Token recibido:', token);
      if (!token) {
        throw new HttpError(401, 'Token de autenticación requerido');
      }

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: allowExpired, // Permitir tokens expirados si está configurado
      });

      // Buscar el usuario en la base de datos
      const user = await User.findById(decoded.user.id).select('-password');
      if (!user) {
        throw new HttpError(401, 'Usuario no encontrado');
      }

      // Adjuntar el usuario a la solicitud
      req.user = user;

      // Verificar roles si es necesario
      if (roles.length && !roles.includes(user.role.toLowerCase())) {
        throw new HttpError(403, 'No tienes permiso para realizar esta acción');
      }

      // Continuar con la siguiente función middleware
      next();
    } catch (error) {
      console.error('Error en autenticación:', error.message || error);
      // Enviar un error 401 si el token es inválido o expirado
      next(new HttpError(401, 'Token inválido o expirado'));
    }
  };
};