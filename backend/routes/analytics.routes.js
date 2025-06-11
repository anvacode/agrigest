const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Rutas de análisis (todas protegidas y restringidas a admin)
router.use(protect);
router.use(restrictTo('admin', 'farmer'));

// Rutas de análisis
router.get('/crop-stats', analyticsController.getCropStatsByLocation);
router.get('/farms-with-owners', analyticsController.getFarmsWithOwners);
router.get('/crop-analytics', analyticsController.getCropAnalytics);
router.get('/user-summary', analyticsController.getUserRoleSummary);

module.exports = router; 