const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmer-db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Auto-initialize tables if database is connected
const initDb = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Connected to MySQL Database successfully.');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`farmer\` (
                \`Farmer-ID\` INT AUTO_INCREMENT PRIMARY KEY,
                \`Name\` VARCHAR(255) NOT NULL,
                \`Email\` VARCHAR(255) NOT NULL UNIQUE,
                \`Contact No\` VARCHAR(50),
                \`Address\` VARCHAR(255),
                \`Password\` VARCHAR(255) NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`farm_input\` (
                \`Input_ID\` INT AUTO_INCREMENT PRIMARY KEY,
                \`farmer_ID\` INT NOT NULL,
                \`Temperature\` VARCHAR(50),
                \`Soil_Condition\` VARCHAR(100),
                \`Crop_Type\` VARCHAR(100),
                \`Weather\` VARCHAR(100),
                \`Date\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`recommendation\` (
                \`Recommendation_ID\` INT AUTO_INCREMENT PRIMARY KEY,
                \`farmer_ID\` INT NOT NULL,
                \`Input_ID\` INT NOT NULL,
                \`Watering_Advice\` TEXT,
                \`Crop_Recommendation\` TEXT,
                \`Pest_Advice\` TEXT,
                \`Animal_Protection_Advice\` TEXT,
                \`Alert_Message\` TEXT,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        connection.release();
    } catch (err) {
        console.warn('⚠️ MySQL connection/initialization warning:', err.message);
    }
};

initDb();

module.exports = promisePool;