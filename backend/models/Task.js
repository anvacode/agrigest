// backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  cultivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cultivo' }, // opcional
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // opcional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
