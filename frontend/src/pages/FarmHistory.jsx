import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { motion } from 'framer-motion';

export default function FarmHistory({ historyRecords: propRecords }) {
  const [historyRecords, setHistoryRecords] = useState(propRecords || []);
  const [loading, setLoading] = useState(!propRecords || propRecords.length === 0);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await API.get('/history');
      if (Array.isArray(response.data)) {
        setHistoryRecords(response.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Styles
  const pageStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e2f7d5' };
  const containerStyle = { display: 'flex', flex: 1 };
  const contentStyle = { flex: 1, padding: '32px 40px', boxSizing: 'border-box' };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />

        <div style={contentStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#1c3c1c', margin: '0 0 5px 0' }}>Farm Recommendation History 📜</h2>
              <p style={{ color: '#446644', margin: 0 }}>Review all past farm input assessments and generated advisory records.</p>
            </div>
            <button 
              onClick={fetchHistory}
              style={{ padding: '8px 16px', backgroundColor: '#3d7a44', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #d1e7dd', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 12px' }}>Date</th>
                  <th style={{ padding: '14px 12px' }}>Crop</th>
                  <th style={{ padding: '14px 12px' }}>Temp</th>
                  <th style={{ padding: '14px 12px' }}>Soil</th>
                  <th style={{ padding: '14px 12px' }}>Weather</th>
                  <th style={{ padding: '14px 12px' }}>Advice Summary</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading records...</td>
                  </tr>
                ) : historyRecords && historyRecords.length > 0 ? (
                  historyRecords.map((rec, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedRecord(rec)}
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        cursor: 'pointer', 
                        transition: 'background-color 0.15s' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {rec.Date ? new Date(rec.Date).toLocaleDateString() : 'Today'}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#166534' }}>
                        {rec.Crop_Type || '—'}
                      </td>
                      <td style={{ padding: '14px 12px' }}>{rec.Temperature ? `${rec.Temperature}°C` : '—'}</td>
                      <td style={{ padding: '14px 12px' }}>{rec.Soil_Condition || '—'}</td>
                      <td style={{ padding: '14px 12px' }}>{rec.Weather || '—'}</td>
                      <td style={{ padding: '14px 12px', color: '#334155', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rec.Watering_Advice || rec.Crop_Recommendation || 'Recommendations available'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '35px', textAlign: 'center', color: '#64748b' }}>
                      No history records found. Enter farm conditions in "Enter Data" to generate recommendations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal / Detail View when a record is clicked */}
          {selectedRecord && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '24px', backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1.5px solid #86efac', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#1c3c1c', fontSize: '20px' }}>
                  Detailed Advice for {selectedRecord.Crop_Type} ({selectedRecord.Date ? new Date(selectedRecord.Date).toLocaleDateString() : 'Recent'})
                </h3>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {selectedRecord.Watering_Advice && (
                  <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '10px' }}>
                    <strong>💧 Watering:</strong> <p style={{ margin: '4px 0 0 0' }}>{selectedRecord.Watering_Advice}</p>
                  </div>
                )}
                {selectedRecord.Crop_Recommendation && (
                  <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '10px' }}>
                    <strong>🌱 Crop / Soil:</strong> <p style={{ margin: '4px 0 0 0' }}>{selectedRecord.Crop_Recommendation}</p>
                  </div>
                )}
                {selectedRecord.Pest_Advice && (
                  <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '10px' }}>
                    <strong>🛡️ Pest Advice:</strong> <p style={{ margin: '4px 0 0 0' }}>{selectedRecord.Pest_Advice}</p>
                  </div>
                )}
                {selectedRecord.Animal_Protection_Advice && (
                  <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '10px' }}>
                    <strong>🐾 Animal Protection:</strong> <p style={{ margin: '4px 0 0 0' }}>{selectedRecord.Animal_Protection_Advice}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}