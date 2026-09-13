import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { motion } from 'framer-motion';

export default function InputData({ setHistoryRecords }) {
  const [formData, setFormData] = useState({
    temperature: '',
    soilCondition: '',
    weather: '',
    cropType: ''
  });
  
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (statusMsg.text) setStatusMsg({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { weather, soilCondition, cropType, temperature } = formData;
    
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // Send farm condition data to the backend API
      const response = await API.post('/farmer/enter-data', {
        temperature,
        soilCondition,
        weather,
        cropType
      });
      
      const data = response.data;
      const recs = data.recommendations || [];
      setRecommendations(recs);
      setStatusMsg({ type: 'success', text: data.message || 'දත්ත සහ නිර්දේශ සාර්ථකව සුරැකිනු ලැබුවා!' });

      if (setHistoryRecords) {
        setHistoryRecords((prev) => [
          {
            Date: new Date().toISOString(),
            Temperature: temperature,
            Soil_Condition: soilCondition,
            Weather: weather,
            Crop_Type: cropType,
            Watering_Advice: data.details?.wateringAdvice || recs[0],
            Crop_Recommendation: data.details?.cropRecommendation || recs[1],
            Pest_Advice: data.details?.pestAdvice || recs[2]
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Save error:", err);
      const errorText = err.response?.data?.message || err.response?.data?.error || "දත්ත සුරැකීමේදී දෝෂයක් ඇති විය.";
      setStatusMsg({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const pageStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e2f7d5' };
  const containerStyle = { display: 'flex', flex: 1 };
  const contentStyle = { flex: 1, padding: '32px 40px', boxSizing: 'border-box' };
  const recBoxStyle = { 
    flex: 1, 
    minHeight: '160px', 
    backgroundColor: '#fff', 
    borderRadius: '16px', 
    border: '1px solid #bbf7d0', 
    padding: '20px', 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    textAlign: 'left', 
    fontWeight: '500', 
    fontSize: '15px', 
    color: '#1c3c1c',
    boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
  };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #a3cfa3', marginTop: '6px', fontSize: '15px', boxSizing: 'border-box', backgroundColor: '#fff' };
  const recommendBtnStyle = { backgroundColor: loading ? '#6b9e71' : '#3d7a44', color: 'white', padding: '12px 36px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '24px', fontWeight: 'bold', fontSize: '18px', transition: '0.2s' };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />

        <div style={contentStyle}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '28px', color: '#1c3c1c', margin: '0 0 8px 0' }}>Enter Farm Conditions 🌱</h2>
        
          </motion.div>

          {statusMsg.text && (
            <div style={{
              padding: '12px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              backgroundColor: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
              fontWeight: 'bold',
              maxWidth: '850px'
            }}>
              {statusMsg.text}
            </div>
          )}

          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '18px', maxWidth: '850px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #d1e7dd' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#1c3c1c' }}>Temperature (උෂ්ණත්වය)</label>
                  <input type="text" name="temperature" placeholder="උදා: 28°C හෝ 30" value={formData.temperature} onChange={handleChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#1c3c1c' }}>Soil Condition (පසෙහි තත්ත්වය)</label>
                  <input type="text" name="soilCondition" placeholder="උදා: තෙත් / වියළි / මැටි සහිත" value={formData.soilCondition} onChange={handleChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#1c3c1c' }}>Weather (කාලගුණය)</label>
                  <input type="text" name="weather" placeholder="උදා: වැසි සහිත / අව්වරහිත / වියළි" value={formData.weather} onChange={handleChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#1c3c1c' }}>Crop Type (බෝග වර්ගය)</label>
                  <input type="text" name="cropType" placeholder="උදා: තක්කාලි / මිරිස් / වී / බටු" value={formData.cropType} onChange={handleChange} style={inputStyle} required />
                </div>
              </div>
              
              <button type="submit" style={recommendBtnStyle} disabled={loading}>
                {loading ? 'Analyzing Data...' : 'Get Recommendation'}
              </button>
            </form>
          </div>

          <h3 style={{ marginTop: '35px', color: '#1c3c1c', fontSize: '22px' }}>Personalized Recommendations 📋</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px', maxWidth: '850px' }}>
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={recBoxStyle}
                >
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{rec}</p>
                </motion.div>
              ))
            ) : (
              <>
                <div style={recBoxStyle}>💧 ජල සම්පාදන නිර්දේශ මෙහි පෙන්වයි...</div>
                <div style={recBoxStyle}>🌱 පාංශු සහ බෝග උපදෙස් මෙහි පෙන්වයි...</div>
                <div style={recBoxStyle}>🛡️ පළිබෝධ සහ ආරක්ෂක උපදෙස් මෙහි පෙන්වයි...</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}