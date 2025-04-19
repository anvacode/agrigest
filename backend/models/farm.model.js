const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  location: { type: String, required: true }, 
  size: { type: Number, required: true }, 
  crops: { type: [String], required: true }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario
}, {
  timestamps: true, 
});

module.exports = mongoose.models.Farm || mongoose.model('Farm', farmSchema);