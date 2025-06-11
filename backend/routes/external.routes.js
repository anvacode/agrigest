// backend/routes/external.routes.js
const express = require('express');
const router = express.Router();
const { getWeather, getMarketPrice } = require('../controllers/external.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/weather', getWeather);
router.get('/market-price', getMarketPrice);

module.exports = router;
