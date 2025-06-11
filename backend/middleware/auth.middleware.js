const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HttpError } = require('../utils/errors');

const protect = async (req, res, next) => {
  try {
    // 1) Obtener el token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log('TOKEN RECIBIDO:', token);

    if (!token) {
      throw new HttpError(401, 'No estás autorizado para acceder a esta ruta');
    }

    // 2) Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('TOKEN DECODED:', decoded);

    // 3) Verificar si el usuario aún existe
    const user = await User.findById(decoded.user.id);
    console.log('USER ENCONTRADO:', user);

    if (!user) {
      throw new HttpError(401, 'El usuario ya no existe');
    }

    // 4) Verificar si el usuario cambió la contraseña después de que el token fue emitido
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      throw new HttpError(401, 'Usuario cambió recientemente la contraseña. Por favor inicie sesión nuevamente');
    }

    // Otorgar acceso a la ruta protegida
    req.user = user;
    next();
  } catch (error) {
    console.error('ERROR EN AUTH MIDDLEWARE:', error);
    if (error.name === 'JsonWebTokenError') {
      next(new HttpError(401, 'Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(new HttpError(401, 'Su token ha expirado. Por favor inicie sesión nuevamente'));
    } else {
      next(error);
    }
  }
};

// Middleware para restringir acceso por roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'No tienes permiso para realizar esta acción'));
    }
    next();
  };
};

module.exports = { protect, restrictTo }; 