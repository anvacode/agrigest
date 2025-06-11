# AgriGest: Sistema de Gestión Agrícola

## Descripción General
AgriGest es una plataforma web para la gestión agrícola, diseñada para ayudar a agricultores y administradores a controlar fincas, cultivos, tareas, usuarios y obtener analíticas avanzadas. El sistema está construido con Angular (frontend) y Node.js/Express + MongoDB (backend), e integra APIs externas para clima y precios de mercado.

---

## Estructura del Proyecto

```
agrigest/
├── backend/
│   ├── controllers/        # Lógica de negocio y endpoints
│   ├── middleware/         # Middlewares de autenticación y manejo de errores
│   ├── models/             # Modelos de datos Mongoose (User, Farm, Cultivo, Task)
│   ├── routes/             # Definición de rutas Express
│   ├── utils/              # Utilidades (email, errores)
│   ├── validations/        # Validaciones con Joi
│   ├── config/             # Configuración de base de datos
│   ├── seed.js             # Script para poblar la base de datos
│   ├── server.js           # Entrada principal del backend
│   └── package.json        # Dependencias backend
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes Angular (dashboard, CRUDs, auth, etc.)
│   │   │   ├── services/   # Servicios Angular para APIs
│   │   │   ├── guards/     # Guards de rutas
│   │   │   ├── interceptors/ # Interceptores HTTP
│   │   ├── environments/   # Configuración de entornos
│   │   ├── styles.scss     # Estilos globales
│   │   └── index.html      # HTML principal
│   ├── angular.json        # Configuración Angular
│   └── package.json        # Dependencias frontend
└── package.json            # Dependencias raíz
```

---

## Funcionalidades Principales

### 1. **Gestión de Usuarios**
- Registro y login con validación robusta.
- Roles: `farmer`, `admin`.
- Perfil de usuario editable (nombre, email, bio, avatar).
- Seguridad: JWT, validación de email, recuperación de contraseña.

### 2. **Gestión de Fincas**
- CRUD completo de fincas (nombre, ubicación, tamaño, cultivos asociados).
- Relación con usuario propietario.
- Validaciones de datos y feedback visual.

### 3. **Gestión de Cultivos**
- CRUD de cultivos (nombre, tipo, fecha de siembra, finca asociada).
- Relación con usuario y finca.
- Edición en línea y eliminación con confirmación.
- Filtro/búsqueda en tabla por nombre, tipo o fecha.

### 4. **Gestión de Tareas Agrícolas**
- CRUD de tareas (nombre, descripción, fecha, estado, cultivo/finca asociada).
- Listado de tareas pendientes y próximas.
- Notificaciones y recordatorios (en desarrollo).

### 5. **Dashboard y Analíticas**
- Panel con KPIs: total de fincas, cultivos, área total, tareas pendientes.
- Gráficos interactivos (barras y torta) para análisis de cultivos.
- Estadísticas por ubicación, tipo de cultivo, usuarios por rol.
- Visualización moderna y responsiva.

### 6. **Integración con APIs Externas**
- Clima: Consulta de pronóstico para cada finca (OpenWeatherMap).
- Precios de mercado: Consulta de precios para cultivos (API Ninjas u otros).
- Manejo de errores y mensajes claros si la API externa falla.

### 7. **Seeders y Datos de Ejemplo**
- Script `seed.js` para poblar la base de datos con usuarios, fincas y cultivos de ejemplo.
- Útil para desarrollo y pruebas.

---

## Seguridad y Buenas Prácticas
- Autenticación JWT y protección de rutas sensibles.
- Validaciones robustas en backend (Joi) y frontend (Angular forms).
- Manejo centralizado de errores y mensajes amigables.
- Hash de contraseñas y control de sesiones.
- Roles y permisos para restringir acciones.

---

## Estilo y Experiencia de Usuario
- UI moderna, responsiva y accesible.
- Feedback visual en formularios y acciones.
- Tablas y grids adaptativos, con filtros y paginación.
- Accesibilidad: uso de atributos `title`, roles y etiquetas ARIA.

---

## Cómo Ejecutar el Proyecto

### Backend
1. Instala dependencias:
   ```powershell
   cd backend
   npm install
   ```
2. Configura variables en `.env` (MONGO_URI, JWT_SECRET, API keys).
3. Ejecuta el servidor:
   ```powershell
   node server.js
   ```
4. (Opcional) Pobla la base de datos:
   ```powershell
   node seed.js
   ```

### Frontend
1. Instala dependencias:
   ```powershell
   cd frontend
   npm install
   ```
2. Ejecuta la app:
   ```powershell
   npm start
   ```
3. Accede a `http://localhost:4200` en tu navegador.

---

## Créditos y Licencia
Desarrollado por Andres Vacca y colaboradores. Uso educativo y profesional. Puedes modificar y adaptar el sistema según tus necesidades.

---

**¡Gracias por usar AgriGest!**
