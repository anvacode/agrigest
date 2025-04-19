const express = require('express');
const router = express.Router();
const { createFarm } = require('../controllers/farm.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/farms', authMiddleware(), createFarm);

module.exports = router;