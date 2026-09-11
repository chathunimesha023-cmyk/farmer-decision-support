const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from Authorization header or custom header
    const authHeader = req.header('Authorization') || req.header('authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
        }

        if (!token) {
            return res.status(401).json({ message: 'Invalid token format. Use "Bearer <token>".' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
        const farmerId = decoded.farmerId || decoded.id || decoded.userId; 

        if (!farmerId) {
            return res.status(401).json({ message: 'Invalid token structure. Farmer ID not found.' });
        }

        req.user = { id: farmerId, email: decoded.email };
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid authentication token.' });
        }
        
        return res.status(400).json({ message: 'Authentication failed.', error: error.message });
    }
};