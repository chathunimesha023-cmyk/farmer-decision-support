const pool = require('../config/db');

// Generate recommendation based on input data
const generateRecommendations = (data) => {
    const cropType = data.cropType || 'බෝගය';
    return {
        wateringAdvice: `💧 ${cropType} සඳහා පසෙහි තෙතමනය පරිදි ජලය සපයන්න.`,
        cropRecommendation: `🌱 ${cropType} වගාවට මෙම තත්ත්වයන් සුදුසුයි.`,
        pestAdvice: "🛡️ පළිබෝධකයන්ගෙන් ආරක්ෂා වීමට සතියකට වරක් පරීක්ෂා කරන්න.",
        animalProtection: "🛡️ වැට සුරක්ෂිත බව තහවුරු කරගන්න.",
        alertMessage: "දත්ත සාර්ථකව විශ්ලේෂණය විය."
    };
};

// Fetch farm input & recommendation history for the logged in farmer
exports.getHistory = async (req, res) => {
    try {
        const farmerId = req.user?.id || req.query.farmerId;
        if (!farmerId) {
            return res.status(401).json({ message: 'User ID missing.' });
        }

        const sql = `
            SELECT 
                fi.Input_ID,
                fi.farmer_ID,
                fi.Temperature,
                fi.Soil_Condition,
                fi.Crop_Type,
                fi.Weather,
                COALESCE(fi.Input_Date, NOW()) as Date,
                r.recommendation_id as Recommendation_ID,
                r.watering_advice as Watering_Advice,
                r.crop_recommendation as Crop_Recommendation,
                r.pest_advice as Pest_Advice,
                r.animal_protection_advice as Animal_Protection_Advice,
                r.alert_message as Alert_Message,
                r.recommendation_date
            FROM farm_input fi
            LEFT JOIN recommendation r ON fi.Input_ID = r.Input_ID
            WHERE fi.farmer_ID = ?
            ORDER BY fi.Input_ID DESC
        `;

        const [records] = await pool.query(sql, [farmerId]);
        return res.status(200).json(records || []);
    } catch (error) {
        console.error('Fetch History Error: ', error);
        return res.status(500).json({ message: 'Error fetching farm history: ' + error.message });
    }
};

// Save a recommendation record
exports.saveRecommendation = async (req, res) => {
    try {
        const farmerId = req.user?.id || req.body.userId;
        const { inputId, temperature, soilCondition, cropType, weather, recommendations: customRecs } = req.body;

        if (!farmerId || !inputId) {
            return res.status(400).json({ message: 'User ID or Input ID missing.' });
        }

        const recommendations = customRecs || generateRecommendations({ temperature, soilCondition, cropType, weather });

        const sql = `INSERT INTO recommendation 
            (farmer_ID, Input_ID, watering_advice, crop_recommendation, pest_advice, animal_protection_advice, alert_message) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        await pool.execute(sql, [
            farmerId,
            inputId,
            recommendations.wateringAdvice || recommendations[0] || '',
            recommendations.cropRecommendation || recommendations[1] || '',
            recommendations.pestAdvice || recommendations[2] || '',
            recommendations.animalProtection || recommendations[3] || '',
            recommendations.alertMessage || 'සාර්ථකයි!'
        ]);

        return res.status(200).json({ message: "සාර්ථකයි!", recommendations });
    } catch (error) {
        console.error('Save Recommendation Error: ', error);
        return res.status(500).json({ message: "දෝෂයක්!", error: error.message });
    }
};