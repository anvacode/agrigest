// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Farm = require('./models/Farm');
const Cultivo = require('./models/Cultivo');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrigest';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Conectado a MongoDB');

  // Limpia las colecciones
  await User.deleteMany({});
  await Farm.deleteMany({});
  await Cultivo.deleteMany({});

  // Crea usuario
  const user = await User.create({
    name: 'Usuario Demo',
    email: 'demo@agrigest.com',
    password: 'demo1234',
    role: 'farmer'
  });

  // Crea finca
  const farm = await Farm.create({
    name: 'Finca Demo',
    location: 'Bogota',
    size: 10,
    crops: ['Maíz', 'Café'],
    owner: user._id
  });

  // Crea cultivos
  const cultivos = await Cultivo.insertMany([
    {
      nombre: 'Maíz',
      tipo: 'Cereal',
      fechaSiembra: '2025-05-01',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Café',
      tipo: 'Grano',
      fechaSiembra: '2025-04-15',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Papa',
      tipo: 'Tubérculo',
      fechaSiembra: '2025-03-10',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Tomate',
      tipo: 'Hortaliza',
      fechaSiembra: '2025-02-20',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Frijol',
      tipo: 'Leguminosa',
      fechaSiembra: '2025-01-15',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Arroz',
      tipo: 'Cereal',
      fechaSiembra: '2025-06-01',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Trigo',
      tipo: 'Cereal',
      fechaSiembra: '2025-07-10',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Cebolla',
      tipo: 'Hortaliza',
      fechaSiembra: '2025-08-05',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Zanahoria',
      tipo: 'Hortaliza',
      fechaSiembra: '2025-09-12',
      farm: farm._id,
      usuarioId: user._id
    },
    {
      nombre: 'Lenteja',
      tipo: 'Leguminosa',
      fechaSiembra: '2025-10-01',
      farm: farm._id,
      usuarioId: user._id
    }
  ]);

  // Relaciona finca con usuario
  user.farms = [farm._id];
  await user.save();

  console.log('Datos de ejemplo insertados.');
  mongoose.disconnect();
}

seed().catch(e => { console.error(e); mongoose.disconnect(); });
