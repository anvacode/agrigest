const Joi = require('joi');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // Validar todos los errores
  if (error) {
    console.error('Error de validación:', error.details); // Registrar los detalles del error
    return res.status(400).json({
      message: 'Datos inválidos',
      details: error.details.map((err) => ({
        message: err.message,
        path: err.path,
        type: err.type,
      })),
    });
  }
  next();
};

module.exports = { validateRequest };
