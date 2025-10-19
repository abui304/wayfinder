const express = require('express');
const router = express.Router();
const { generateItinerary, getLatestItinerary, getItineraryById } = require('../controllers/itineraryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, generateItinerary);
router.get('/latest', authMiddleware, getLatestItinerary);
router.get('/:id', authMiddleware, getItineraryById);

module.exports = router;