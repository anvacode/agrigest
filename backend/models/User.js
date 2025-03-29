const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto'); // Para generación de tokens
const { HttpError } = require('../utils/errors');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Por favor ingrese un email válido'
    },
    index: true // Mejora rendimiento en búsquedas
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['farmer', 'admin'],
      message: 'El rol debe ser "farmer" o "admin"'
    },
    default: 'farmer'
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: function() {
      return this.role === 'farmer';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true, // Maneja automáticamente createdAt y updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v; // Elimina versión del documento
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware para hashear la contraseña
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (error) {
    next(new HttpError(500, 'Error al hashear la contraseña'));
  }
});

// Métodos del modelo
UserSchema.methods = {
  comparePassword: async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  changedPasswordAfter: function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  },

  createPasswordResetToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
    
    return resetToken;
  },

  createVerificationToken: function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    
    return verificationToken;
  }
};

// Query middleware para excluir usuarios inactivos
UserSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Virtual populate
UserSchema.virtual('farmDetails', {
  ref: 'Farm',
  localField: 'farm',
  foreignField: '_id',
  justOne: true
});

// Índices para mejorar rendimiento
UserSchema.index({ email: 1 }); // Índice único ya está por unique: true
UserSchema.index({ farm: 1 });

module.exports = mongoose.model('User', UserSchema);