// backend/utils/exchange.js
const axios = require('axios');

// Consulta la tasa de cambio USD a COP usando la API de ExchangeRate-API (gratuita)
async function getUsdToCopRate() {
  try {
    // Puedes usar otras APIs gratuitas si esta falla (ej: exchangerate.host)
    const res = await axios.get('https://api.exchangerate.host/latest', {
      params: { base: 'USD', symbols: 'COP' }
    });
    if (res.data && res.data.rates && res.data.rates.COP) {
      return res.data.rates.COP;
    }
    throw new Error('No se pudo obtener la tasa de cambio USD/COP');
  } catch (err) {
    throw new Error('Error consultando tasa de cambio: ' + err.message);
  }
}

module.exports = { getUsdToCopRate };
