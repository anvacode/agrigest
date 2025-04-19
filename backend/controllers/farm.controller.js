const Farm = require('../models/farm.model');

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
      user: req.user.id, // Asociar la finca al usuario autenticado
    });

    res.status(201).json({ message: 'Finca creada exitosamente.', farm: newFarm });
  } catch (error) {
    console.error('Error al crear la finca:', error);
    res.status(500).json({ message: 'Error al crear la finca.' });
  }
};

module.exports = { createFarm };