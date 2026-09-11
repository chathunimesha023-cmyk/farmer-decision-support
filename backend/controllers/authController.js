const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

exports.register = async (req, res) => {
    const { name, email, contact_no, address, password } = req.body;

    // Validation - check required fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    try {
        const [existingUser] = await pool.query('SELECT Email FROM farmer WHERE Email = ?', [email]);
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ error: 'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත. (This email is already registered.)' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Enter user into database
        const sql = 'INSERT INTO farmer (Name, Email, `Contact No`, Address, Password) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [name, email, contact_no || '', address || '', hashedPassword]);
        
        const farmerId = result.insertId;
        const token = jwt.sign({ farmerId, email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({ 
            message: 'Registration successful!', 
            farmerId, 
            userId: farmerId,
            token,
            userInfo: { name, email }
        });
    } catch (error) {
        console.error('Registration Error: ', error);
        return res.status(500).json({ error: 'Database error: ' + error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [results] = await pool.query('SELECT * FROM farmer WHERE Email = ?', [email]);
        if (!results || results.length === 0) {
            return res.status(401).json({ message: 'User not found with this email.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password!' });
        }

        const farmerId = user['Farmer-ID'] || user['farmer_ID'] || user['id'] || user.farmerId;
        const token = jwt.sign({ farmerId, email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({ 
            message: 'Login successful', 
            farmerId, 
            userId: farmerId,
            token,
            userInfo: { name: user.Name, email: user.Email }
        });
    } catch (error) {
        console.error('Login Error: ', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
};