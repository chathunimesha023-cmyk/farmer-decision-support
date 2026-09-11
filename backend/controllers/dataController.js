const pool = require('../config/db');

// Helper function to generate rich, contextual recommendations
const generateRecommendations = ({ temperature, soilCondition, cropType, weather }) => {
    const crop = (cropType || 'බෝගය').trim();
    const soil = (soilCondition || '').toLowerCase();
    const w = (weather || '').toLowerCase();
    const tempNum = parseFloat(temperature);

    let wateringAdvice = '';
    let cropAdvice = '';
    let pestAdvice = '';
    let animalAdvice = 'වැට සහ මායිම් ආරක්ෂිත බව තහවුරු කරගන්න. සතුන් බිය ගැන්වීමේ උපකරණ හෝ ආලෝක පහන් භාවිත කරන්න.';
    let alertMessage = 'දත්ත සාර්ථකව විශ්ලේෂණය කර නිර්දේශ සකස් කරන ලදී.';

    // Weather & Temperature based Watering Advice
    if (w.includes('වැසි') || w.includes('rain')) {
        wateringAdvice = `💧 ජලය: ${crop} සඳහා අතිරේක ජලය සැපයීම අවශ්‍ය නොවේ. පාංශු ජල බැස යාම සඳහා කාණු පද්ධතිය විවෘතව තබන්න.`;
    } else if (tempNum >= 32 || w.includes('වියළි') || w.includes('dry') || w.includes('hot') || w.includes('රස්න')) {
        wateringAdvice = `💧 ජලය: අධික උෂ්ණත්වය නිසා ${crop} මූල පද්ධතියට උදෑසන 6.00-8.00 හෝ සවස 5.00 න් පසු බිංදු ජල සම්පාදනය මගින් ජලය සපයන්න.`;
    } else {
        wateringAdvice = `💧 ජලය: ${crop} සඳහා පසෙහි තෙතමනය 60% මට්ටමේ පවත්වා ගැනීමට දිනපතා හෝ දිනක් හැර දිනක් මධ්‍යස්ථව ජලය සපයන්න.`;
    }

    // Soil condition based advice
    if (soil.includes('තෙත්') || soil.includes('wet') || soil.includes('humid')) {
        cropAdvice = `🌱 පස & බෝගය: පසෙහි තෙතමනය අධික බැවින් පාංශු වාතාශ්‍රය සඳහා පස මතුපිට සැහැල්ලුවෙන් බුරුල් කරන්න. කොම්පෝස්ට් මිශ්‍රණය යොදන්න.`;
    } else if (soil.includes('වියළි') || soil.includes('dry') || soil.includes('වැලි') || soil.includes('sandy')) {
        cropAdvice = `🌱 පස & බෝගය: පසෙහි තෙතමනය රඳවා ගැනීමට සහ උෂ්ණත්වය පාලනයට වියළි පිදුරු හෝ කොළ වසුන් (Mulching) අතුරන්න.`;
    } else {
        cropAdvice = `🌱 පස & බෝගය: ${crop} වගාවට මෙම තත්ත්වයන් ඉතා යෝග්‍ය වේ. නයිට්‍රජන්, පොස්පරස් හා පොටෑසියම් (NPK) සමබරව ලබා දෙන්න.`;
    }

    // Pest advice based on conditions and crop
    if (w.includes('වැසි') || soil.includes('තෙත්')) {
        pestAdvice = `🛡️ පළිබෝධ & රෝග: දිලීර හා මුල් කුණුවීමේ රෝග වළක්වා ගැනීමට කොහොඹ ඇට සාරය හෝ තඹ මිශ්‍ර දිලීර නාශක යොදන්න.`;
    } else if (crop.includes('මිරිස්') || crop.includes('තක්කාලි') || crop.includes('chili') || crop.includes('tomato')) {
        pestAdvice = `🛡️ පළිබෝධ පාලනය: සුදු මැස්සන් සහ කොළ කොඩවීමේ රෝග පාලනයට කහ පැහැති ඇලෙන උගුල් (Yellow sticky traps) වගා බිමේ සවිකරන්න.`;
    } else {
        pestAdvice = `🛡️ පළිබෝධ පාලනය: සතියකට වරක් ශාක පත්‍ර යටි පැත්ත පරීක්ෂා කර ස්වාභාවික කොහොඹ තෙල් ද්‍රාවණ භාවිත කරන්න.`;
    }

    const adviceList = [
        wateringAdvice,
        cropAdvice,
        pestAdvice,
        `🛡️ සත්ව හානි: ${animalAdvice}`
    ];

    return {
        wateringAdvice,
        cropRecommendation: cropAdvice,
        pestAdvice,
        animalProtection: animalAdvice,
        alertMessage,
        list: adviceList
    };
};

exports.enterData = async (req, res) => {
    const { temperature, soilCondition, cropType, weather } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Farmer ID not found.' });
    }

    if (!temperature || !soilCondition || !cropType || !weather) {
        return res.status(400).json({ message: 'All farm condition fields are required.' });
    }

    try {
        // 1. Insert into farm_input table
        const inputSql = `INSERT INTO farm_input (farmer_ID, Temperature, Soil_Condition, Crop_Type, Weather) VALUES (?, ?, ?, ?, ?)`;
        const [inputResult] = await pool.execute(inputSql, [userId, temperature, soilCondition, cropType, weather]);
        const inputId = inputResult.insertId;

        // 2. Generate recommendations
        const rec = generateRecommendations({ temperature, soilCondition, cropType, weather });

        // 3. Save recommendations to recommendation table (matching exact schema)
        const recSql = `INSERT INTO recommendation 
            (farmer_ID, Input_ID, watering_advice, crop_recommendation, pest_advice, animal_protection_advice, alert_message) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(recSql, [
            userId,
            inputId,
            rec.wateringAdvice,
            rec.cropRecommendation,
            rec.pestAdvice,
            rec.animalProtection,
            rec.alertMessage
        ]);

        return res.status(200).json({
            message: 'දත්ත සහ නිර්දේශ සාර්ථකව සුරැකිනු ලැබුවා!',
            insertId: inputId,
            recommendations: rec.list,
            details: rec
        });
    } catch (error) {
        console.error('Data Input Error: ', error);
        return res.status(500).json({ error: 'Database error: ' + error.message });
    }
};