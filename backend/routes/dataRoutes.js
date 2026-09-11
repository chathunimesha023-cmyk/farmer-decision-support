const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const protect = require('../middleware/authMiddleware');

// Route to enter farm conditions and get recommendations
router.post('/enter-data', protect, dataController.enterData);

module.exports = router;