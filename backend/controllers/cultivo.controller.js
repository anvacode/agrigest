const Cultivo = require('../models/Cultivo');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Crear un nuevo cultivo asociado al usuario autenticado
const createCultivo = async (req, res) => {
  const { nombre, tipo, fechaSiembra, farm } = req.body;

  if (!nombre || !tipo || !fechaSiembra || !farm) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const nuevoCultivo = await Cultivo.create({
      nombre,
      tipo,
      fechaSiembra,
      farm,
      usuarioId: req.user._id
    });

    // Obtener el email del usuario
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      // Enviar correo de notificación
      await sendEmail(
        user.email,
        'Nuevo cultivo creado',
        `Hola ${user.name},\n\nSe ha creado un nuevo cultivo: ${nombre} (${tipo}), con fecha de siembra: ${fechaSiembra}.\n\nSaludos,\nEquipo Agrigest`
      );
    }

    res.status(201).json({
      status: 'success',
      data: nuevoCultivo
    });
  } catch (error) {
    console.error('Error al crear el cultivo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el cultivo',
      error: error.message
    });
  }
};

// Obtener todos los cultivos del usuario autenticado
const getCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.find({ usuarioId: req.user._id });
    res.status(200).json({
      status: 'success',
      data: cultivos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los cultivos',
      error: error.message
    });
  }
};

// Eliminar un cultivo
const deleteCultivo = async (req, res) => {
  try {
    const cultivo = await Cultivo.findOneAndDelete({ _id: req.params.id, usuarioId: req.user._id });
    if (!cultivo) {
      return res.status(404).json({ message: 'Cultivo no encontrado' });
    }
    res.json({ status: 'success', message: 'Cultivo eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar el cultivo', error: error.message });
  }
};

// Editar un cultivo
const updateCultivo = async (req, res) => {
  try {
    const cultivo = await Cultivo.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.user._id },
      req.body,
      { new: true }
    );
    if (!cultivo) {
      return res.status(404).json({ message: 'Cultivo no encontrado' });
    }
    res.json({ status: 'success', data: cultivo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar el cultivo', error: error.message });
  }
};

// Obtener cultivos con información de finca y usuario ($lookup)
const getCultivosConJoin = async (req, res) => {
  try {
    const cultivos = await require('../models/Cultivo').aggregate([
      {
        $lookup: {
          from: 'farms',
          localField: 'farm',
          foreignField: '_id',
          as: 'farmInfo'
        }
      },
      { $unwind: '$farmInfo' },
      {
        $lookup: {
          from: 'users',
          localField: 'farmInfo.owner',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      { $unwind: '$ownerInfo' },
      {
        $project: {
          _id: 1,
          nombre: 1,
          tipo: 1,
          fechaSiembra: 1,
          'farmInfo.name': 1,
          'farmInfo.location': 1,
          'ownerInfo.name': 1,
          'ownerInfo.email': 1
        }
      }
    ]);
    res.json({ status: 'success', data: cultivos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener cultivos con join', error: error.message });
  }
};

module.exports = { createCultivo, getCultivos, deleteCultivo, updateCultivo, getCultivosConJoin }; 