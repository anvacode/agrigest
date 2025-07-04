require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');
const farmRoutes = require('./routes/farm.routes');
const analyticsRoutes = require('./routes/analytics.routes'); 
const cultivoRoutes = require('./routes/cultivo.routes');
const taskRoutes = require('./routes/task.routes'); // Importar las rutas de tareas
const externalRoutes = require('./routes/external.routes'); // Importar las rutas externas

// Verificar si MONGO_URI está definido
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI no está definido en .env");
  process.exit(1);
}

const app = express();

// Middleware para parsear JSON (debe ir antes de CORS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuración avanzada de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200', // URL del frontend
  credentials: true, // Permitir envío de cookies y encabezados de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Middleware para registrar solicitudes entrantes (depuración)
app.use((req, res, next) => {
  console.log('Solicitud recibida:');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Encabezados:', req.headers);
  next();
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cultivos', cultivoRoutes);
app.use('/api/tasks', taskRoutes); // Usar las rutas de tareas
app.use('/api/external', externalRoutes); // Usar las rutas externas

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor solo si la DB se conecta
const startServer = async () => {
  try {
    await connectDB();  // Esperar conexión antes de iniciar el servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);  // Cerrar el proceso si hay un error crítico
  }
};

startServer();