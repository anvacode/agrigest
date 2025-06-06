const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { validateRequest } = require('../validations/validation');
const { 
  registerSchema, 
  loginSchema 
} = require('../validations/auth.validation');

// Ruta de registro con validaciones
router.post(
  '/register',
  validateRequest(registerSchema),
  register
);

// Ruta de login con validaciones
router.post(
  '/login',
  validateRequest(loginSchema),
  login
);

// Controlador para manejar las fincas
const { createFarm } = require('../controllers/farm.controller');

// Ruta para crear una nueva finca
router.post('/api/farms', createFarm);

// Ruta para verificar estado del servidor de autenticación
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth service is running' });
});

module.exports = router;