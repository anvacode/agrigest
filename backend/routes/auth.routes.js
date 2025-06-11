const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/auth.controller');
const { validateRequest } = require('../validations/validation');
const { 
  registerSchema, 
  loginSchema 
} = require('../validations/auth.validation');
const { protect } = require('../middleware/auth.middleware');

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

// Ruta para actualizar perfil (protegida)
router.put('/profile', protect, updateProfile);

// Ruta para verificar estado del servidor de autenticación
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth service is running' });
});

module.exports = router;