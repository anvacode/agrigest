const Joi = require('joi');

const farmSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  size: Joi.number().positive().required(),
  crops: Joi.array().items(Joi.string()).required(),
});

// Expresión regular para validar contraseñas fuertes
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?~`]{8,30}$/;

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.max': 'La contraseña no puede exceder los 30 caracteres.',
      'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
      'any.required': 'La contraseña es obligatoria.',
    }),
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
    .required()
    .messages({
      'any.required': 'La contraseña es obligatoria.',
    }),
});

module.exports = { loginSchema, registerSchema };