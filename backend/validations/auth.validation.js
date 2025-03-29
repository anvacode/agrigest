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

module.exports = { registerSchema };
