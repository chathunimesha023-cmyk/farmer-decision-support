const pool = require('../config/db');

exports.getStats = async (req, res) => {
    // Get farmerId from auth middleware or query
    const farmerId = req.user?.id || req.query.farmerId;

    try {
        let count = 0;
        let latestRecommendation = null;

        if (farmerId) {
            // Count records for this specific farmer
            const [crops] = await pool.query('SELECT COUNT(*) as count FROM farm_input WHERE `farmer_ID` = ?', [farmerId]);
            count = crops[0]?.count || 0;

            // Fetch the most recent recommendation
            const [recent] = await pool.query(`
                SELECT 
                    r.recommendation_id as Recommendation_ID,
                    r.watering_advice as Watering_Advice,
                    r.crop_recommendation as Crop_Recommendation,
                    r.pest_advice as Pest_Advice,
                    r.animal_protection_advice as Animal_Protection_Advice,
                    r.alert_message as Alert_Message,
                    fi.Crop_Type, 
                    COALESCE(fi.Input_Date, NOW()) as Date 
                FROM recommendation r
                JOIN farm_input fi ON r.Input_ID = fi.Input_ID
                WHERE r.farmer_ID = ?
                ORDER BY r.recommendation_id DESC LIMIT 1
            `, [farmerId]);

            if (recent && recent.length > 0) {
                latestRecommendation = recent[0];
            }
        } else {
            // Global count fallback
            const [crops] = await pool.query('SELECT COUNT(*) as count FROM farm_input');
            count = crops[0]?.count || 0;
        }

        return res.status(200).json({
            count: count,
            totalCrops: count,
            profit: count > 0 ? count * 2500 + 5000 : 0,
            latestRecommendation: latestRecommendation
        });
    } catch (error) {
        console.error("Dashboard Error: ", error);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};