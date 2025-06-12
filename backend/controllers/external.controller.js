// backend/controllers/external.controller.js
const axios = require('axios');
const { getUsdToCopRate } = require('../utils/exchange');

// API Key y endpoint de OpenWeatherMap 
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo'; 
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// API de precios de mercado (ejemplo: FAO, o puedes simular)
const MARKET_API_URL = 'https://api.api-ninjas.com/v1/marketdata'; 
const MARKET_API_KEY = process.env.MARKET_API_KEY || 'demo';

// Traducción básica de cultivos comunes ES->EN para la API externa
const cropTranslations = {
  'maíz': 'maize',
  'frijol': 'bean',
  'arroz': 'rice',
  'café': 'coffee',
  'trigo': 'wheat',
  'papa': 'potato',
  'tomate': 'tomato',
  'cebolla': 'onion',
  'lenteja': 'lentil',
  'zanahoria': 'carrot',
};

// Pronóstico del clima para una finca (por ubicación)
exports.getWeather = async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ message: 'Se requiere la ubicación.' });
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: location,
        appid: WEATHER_API_KEY,
        lang: 'es',
        units: 'metric'
      }
    });
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    let apiError = error.response && error.response.data ? error.response.data : error.message;
    res.status(500).json({ status: 'error', message: 'No se pudo obtener el clima', apiError });
  }
};

// Precios de mercado de un cultivo
exports.getMarketPrice = async (req, res) => {
  let { crop } = req.query;
  if (!crop) return res.status(400).json({ message: 'Se requiere el nombre del cultivo.' });
  // Traducción automática si es necesario
  const cropKey = crop.trim().toLowerCase();
  if (cropTranslations[cropKey]) {
    crop = cropTranslations[cropKey];
  }
  try {
    // Consulta el precio en USD
    const response = await axios.get(MARKET_API_URL, {
      params: { symbol: crop },
      headers: { 'X-Api-Key': MARKET_API_KEY }
    });
    let priceUSD = null;
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].price) {
      priceUSD = response.data[0].price;
    }
    // Si no hay precio, responde igual
    if (!priceUSD) {
      return res.json({ status: 'success', data: response.data, priceCOP: null, currency: 'USD' });
    }
    // Consulta la tasa de cambio USD/COP
    const usdToCop = await getUsdToCopRate();
    const priceCOP = Math.round(priceUSD * usdToCop);
    // Devuelve ambos precios
    res.json({ status: 'success', data: response.data, priceCOP, currency: 'COP', usdToCop });
  } catch (error) {
    // Log detallado para depuración
    console.error('Error al consultar precio de mercado:', error?.response?.data || error.message);
    res.status(500).json({ status: 'error', message: 'No se pudo obtener el precio de mercado', error: error.message });
  }
};
