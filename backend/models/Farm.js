// backend/models/Farm.js
const mongoose = require('mongoose');
const { HttpError } = require('../utils/errors');

const FarmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la finca es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'El tamaño es requerido'],
    min: [0.1, 'El tamaño mínimo es 0.1 hectáreas']
  },
  crops: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para actualizar updatedAt
FarmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farm', FarmSchema);