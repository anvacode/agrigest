const express = require('express');
const router = express.Router();
const { createCultivo, getCultivos, deleteCultivo, updateCultivo, getCultivosConJoin } = require('../controllers/cultivo.controller');
const { protect } = require('../middleware/auth.middleware');

// Ruta para crear un nuevo cultivo (solo usuarios autenticados)
router.post('/', protect, createCultivo);

// Ruta para obtener los cultivos del usuario autenticado
router.get('/', protect, getCultivos);

// Ruta para eliminar un cultivo (solo usuarios autenticados)
router.delete('/:id', protect, deleteCultivo);

// Ruta para actualizar un cultivo (solo usuarios autenticados)
router.put('/:id', protect, updateCultivo);

// Ruta para obtener cultivos con join de finca y usuario
router.get('/join', protect, getCultivosConJoin);

module.exports = router; 