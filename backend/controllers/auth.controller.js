const User = require('../models/User');
const Farm = require('../models/Farm');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { HttpError } = require('../utils/errors');

// Configuración de tokens
const generateToken = (userId, role) => {
  return jwt.sign(
    { user: { id: userId, role } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

exports.register = async (req, res, next) => {
  try {
    // Validación de campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError(400, 'Validation errors', errors.array());
    }

    const { name, email, password, role, farm } = req.body;
    
    // Verificar usuario existente
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new HttpError(409, 'Email already in use');
    }

    // Crear finca primero
    const newFarm = new Farm({
      name: farm.name,
      location: farm.location,
      size: farm.size,
      crops: farm.crops || []
    });
    await newFarm.save();

    // Crear usuario
    const user = new User({
      name,
      email,
      password,
      role,
      farm: newFarm._id
    });

    await user.save();

    // Generar token
    const token = generateToken(user.id, user.role);

    // Respuesta exitosa
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        farm: {
          id: newFarm._id,
          name: newFarm.name,
          location: newFarm.location
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario y validar
    const user = await User.findOne({ email }).select('+password').populate('farm');
    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError(401, 'Invalid credentials');
    }

    // Generar token
    const token = generateToken(user.id, user.role);

    // Respuesta exitosa
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        farm: user.farm
      }
    });

  } catch (error) {
    next(error);
  }
};