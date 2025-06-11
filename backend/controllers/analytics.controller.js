const Farm = require('../models/Farm');
const User = require('../models/User');
const { HttpError } = require('../utils/errors');

// Obtener estadísticas de cultivos por ubicación
exports.getCropStatsByLocation = async (req, res, next) => {
  try {
    const stats = await Farm.aggregate([
      // $group - Agrupar por ubicación y calcular estadísticas
      {
        $group: {
          _id: "$location",
          totalFarms: { $sum: 1 },
          averageSize: { $avg: "$size" },
          crops: { $addToSet: "$crops" },
          totalArea: { $sum: "$size" }
        }
      },
      // $project - Remodelar la salida
      {
        $project: {
          _id: 0,
          location: "$_id",
          totalFarms: 1,
          averageSize: { $round: ["$averageSize", 2] },
          uniqueCrops: { $size: "$crops" },
          totalArea: 1
        }
      },
      // $sort - Ordenar por área total
      {
        $sort: { totalArea: -1 }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(new HttpError(500, 'Error al obtener estadísticas de cultivos'));
  }
};

// Obtener granjas con sus propietarios
exports.getFarmsWithOwners = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, minSize } = req.query;
    const skip = (page - 1) * limit;

    const pipeline = [
      // $lookup - Unir con la colección de usuarios
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'farm',
          as: 'owner'
        }
      },
      // $unwind - Deconstruir el array de propietarios
      {
        $unwind: '$owner'
      }
    ];

    // $match - Filtrar por tamaño si se especifica
    if (minSize) {
      pipeline.push({
        $match: {
          size: { $gte: parseFloat(minSize) }
        }
      });
    }

    // Añadir ordenamiento, skip y limit
    pipeline.push(
      { $sort: { size: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      // $project - Seleccionar campos específicos
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          size: 1,
          crops: 1,
          'owner.name': 1,
          'owner.email': 1
        }
      }
    );

    const farms = await Farm.aggregate(pipeline);
    res.json({ success: true, data: farms });
  } catch (error) {
    next(new HttpError(500, 'Error al obtener granjas con propietarios'));
  }
};

// Análisis de cultivos
exports.getCropAnalytics = async (req, res, next) => {
  try {
    const analytics = await Farm.aggregate([
      // $unwind - Separar arrays de cultivos
      {
        $unwind: '$crops'
      },
      // $group - Agrupar por cultivo
      {
        $group: {
          _id: '$crops',
          count: { $sum: 1 },
          totalArea: { $sum: '$size' },
          farms: { $push: { name: '$name', location: '$location' } }
        }
      },
      // $project - Formatear salida
      {
        $project: {
          _id: 0,
          crop: '$_id',
          count: 1,
          totalArea: 1,
          farms: { $slice: ['$farms', 5] } // Limitar a 5 granjas por cultivo
        }
      },
      // $sort - Ordenar por cantidad
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({ success: true, data: analytics });
  } catch (error) {
    next(new HttpError(500, 'Error al obtener análisis de cultivos'));
  }
};

// Resumen de usuarios por rol
exports.getUserRoleSummary = async (req, res, next) => {
  try {
    const summary = await User.aggregate([
      // $group - Agrupar por rol
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          users: {
            $push: {
              name: '$name',
              email: '$email',
              createdAt: '$createdAt'
            }
          }
        }
      },
      // $project - Formatear salida
      {
        $project: {
          _id: 0,
          role: '$_id',
          count: 1,
          recentUsers: { $slice: ['$users', 3] }
        }
      }
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    next(new HttpError(500, 'Error al obtener resumen de usuarios'));
  }
}; 