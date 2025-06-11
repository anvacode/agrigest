// backend/controllers/external.controller.js
const axios = require('axios');

// API Key y endpoint de OpenWeatherMap (puedes cambiar por otra API si tienes preferencia)
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo'; // Reemplaza 'demo' por tu API key real
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// API de precios de mercado (ejemplo: FAO, o puedes simular)
const MARKET_API_URL = 'https://api.api-ninjas.com/v1/marketdata'; // Ejemplo, puedes cambiar
const MARKET_API_KEY = process.env.MARKET_API_KEY || 'demo';

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
  const { crop } = req.query;
  if (!crop) return res.status(400).json({ message: 'Se requiere el nombre del cultivo.' });
  try {
    // Ejemplo con API Ninjas (puedes cambiar por otra API real)
    const response = await axios.get(MARKET_API_URL, {
      params: { symbol: crop },
      headers: { 'X-Api-Key': MARKET_API_KEY }
    });
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'No se pudo obtener el precio de mercado', error: error.message });
  }
};
