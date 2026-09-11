const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const recommendationController = require('../controllers/recommendationController');

// Get history records
router.get('/', protect, recommendationController.getHistory);
router.get('/history', protect, recommendationController.getHistory);

// Save recommendation
router.post('/save', protect, recommendationController.saveRecommendation);

module.exports = router;