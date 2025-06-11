const express = require('express');
const router = express.Router();
const { createFarm, getFarms, updateFarm } = require('../controllers/farm.controller');
const { protect } = require('../middleware/auth.middleware');

// Proteger todas las rutas
router.use(protect);

// Rutas de fincas
router.get('/', getFarms);
router.post('/', createFarm);
router.put('/:id', updateFarm);

module.exports = router;