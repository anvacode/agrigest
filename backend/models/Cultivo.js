const mongoose = require('mongoose');

const cultivoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  fechaSiembra: {
    type: Date,
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  //Aqui se agrega el id de la granja para el join ($lookup)
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
});

module.exports = mongoose.model('Cultivo', cultivoSchema);
