const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Imports 
const authRoutes = require('./routes/authRoutes'); 
const dataRoutes = require('./routes/dataRoutes'); 
const recommendationRoutes = require('./routes/recommendationRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes');

// Routes Usage - with aliases for maximum compatibility
app.use('/api/auth', authRoutes);
app.use('/api/farmer', dataRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/history', recommendationRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stats', dashboardRoutes);

// Root / Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Farmer Decision Support API is operational' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});