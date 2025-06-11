const Farm = require('../models/Farm');

// Obtener todas las fincas del usuario
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    res.status(200).json({
      status: 'success',
      data: farms
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las fincas',
      error: error.message
    });
  }
};

// Crear una nueva finca
const createFarm = async (req, res) => {
  const { name, location, size, crops } = req.body;

  if (!name || !location || !size || !crops) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (typeof size !== 'number' || size <= 0) {
    return res.status(400).json({ message: 'El tamaño debe ser un número positivo.' });
  }

  if (!Array.isArray(crops)) {
    return res.status(400).json({ message: 'Los cultivos deben ser un arreglo de cadenas.' });
  }

  try {
    const newFarm = await Farm.create({
      name,
      location,
      size,
      crops,
      owner: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: newFarm
    });
  } catch (error) {
    console.error('Error al crear la finca:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la finca',
      error: error.message
    });
  }
};

// Actualizar una finca existente
const updateFarm = async (req, res) => {
  const { id } = req.params;
  const { name, location, size, crops } = req.body;

  if (!name || !location || !size || !crops) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (typeof size !== 'number' || size <= 0) {
    return res.status(400).json({ message: 'El tamaño debe ser un número positivo.' });
  }

  if (!Array.isArray(crops)) {
    return res.status(400).json({ message: 'Los cultivos deben ser un arreglo de cadenas.' });
  }

  try {
    // Solo permitir que el propietario actualice su finca
    const farm = await Farm.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { name, location, size, crops },
      { new: true, runValidators: true }
    );
    if (!farm) {
      return res.status(404).json({ message: 'Finca no encontrada o no autorizada.' });
    }
    res.status(200).json({ status: 'success', data: farm });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la finca',
      error: error.message
    });
  }
};

module.exports = { getFarms, createFarm, updateFarm };