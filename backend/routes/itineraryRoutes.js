const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../controllers/itineraryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, generateItinerary);

module.exports = router;