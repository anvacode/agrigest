const Joi = require('joi');

const farmSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  size: Joi.number().positive().required(),
  crops: Joi.array().items(Joi.string()).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid('farmer', 'admin', 'user').required(),
  farm: farmSchema.required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'El correo electrónico debe ser válido.',
      'any.required': 'El correo electrónico es obligatorio.',
    }),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres.',
      'string.max': 'La contraseña no puede exceder los 30 caracteres.',
      'any.required': 'La contraseña es obligatoria.',
    }),
});

module.exports = { loginSchema, registerSchema };