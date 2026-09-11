const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (authHeader) {
        return protect(req, res, next);
    }
    next();
};

// Stats endpoints
router.get('/stats', optionalAuth, dashboardController.getStats);
router.get('/', optionalAuth, dashboardController.getStats);

module.exports = router;