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

// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError(400, 'El correo electrónico ya está registrado');
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'farmer'
    });

    // Si se proporcionan datos de finca y el usuario es farmer, crear la finca
    if (req.body.farm && role === 'farmer') {
      const farm = await Farm.create({
        ...req.body.farm,
        owner: user._id
      });
      user.farms = [farm._id];
      await user.save();
    }

    // Generar token
    const token = generateToken(user._id, user.role);

    // Enviar respuesta
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuario
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar entrada
    if (!email || !password) {
      throw new HttpError(400, 'El correo electrónico y la contraseña son obligatorios');
    }

    // Buscar usuario y sus fincas
    const user = await User.findOne({ email })
      .select('+password')
      .populate('farms');

    if (!user) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    // Generar token
    const token = generateToken(user._id, user.role);

    // Enviar respuesta
    res.json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          farms: user.farms
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil de usuario
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email, bio, avatar } = req.body;

    // Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({ message: 'Nombre y email son obligatorios.' });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, bio, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        }
      }
    });
  } catch (error) {
    next(error);
  }
};