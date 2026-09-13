import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import API from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRecords: 0,
    profit: 0,
    latestRecommendation: null,
  });
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Farmer';

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        const data = res.data;
        setStats({
          totalRecords: data.totalCrops ?? data.count ?? 0,
          profit: data.profit ?? 0,
          latestRecommendation: data.latestRecommendation ?? null,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Styles
  const pageStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e2f7d5' };
  const containerStyle = { display: 'flex', flex: 1 };
  const contentStyle = { flex: 1, padding: '32px 40px', boxSizing: 'border-box' };
  const cardStyle = { 
    backgroundColor: '#fff', 
    padding: '24px', 
    borderRadius: '18px', 
    border: '1px solid #d1e7dd', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={containerStyle}>
        {/* Reusable Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={contentStyle}>
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 style={{ color: '#1c3c1c', fontSize: '32px', margin: '0 0 10px 0' }}>
              Hello, {userName} 👋
            </h2>
            <p style={{ color: '#446644', margin: '0 0 25px 0', fontSize: '16px' }}>
              Welcome back to your farming intelligence control center.
            </p>
          </motion.div>

          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            
            {/* Total Records Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={cardStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Total Farm Inputs</p>
                <span style={{ fontSize: '24px' }}>🌾</span>
              </div>
              <h3 style={{ margin: '10px 0 0 0', color: '#1c3c1c', fontSize: '32px' }}>
                {loading ? '...' : stats.totalRecords}
              </h3>
            </motion.div>

            {/* AI Chatbot Status */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={cardStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Agri Assistant</p>
                <span style={{ fontSize: '24px' }}>🤖</span>
              </div>
              <h3 style={{ margin: '10px 0 0 0', color: '#2e7d32', fontSize: '32px' }}>Online</h3>
            </motion.div>

            {/* Quick Action Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ ...cardStyle, backgroundColor: '#3d7a44', color: '#fff', cursor: 'pointer' }}
              onClick={() => navigate('/input-data')}
            >
              <p style={{ fontSize: '13px', color: '#dcfce7', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>New Assessment</p>
              <h3 style={{ margin: '10px 0 0 0', color: '#fff', fontSize: '22px' }}>+ Enter Farm Data</h3>
            </motion.div>
          </div>

          {/* Latest Recommendation Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            style={{ ...cardStyle, marginTop: '30px', padding: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <h4 style={{ margin: 0, fontSize: '20px', color: '#1c3c1c' }}>
                Latest Agricultural Recommendation
              </h4>
            </div>

            {stats.latestRecommendation ? (
              <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#166534' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '16px' }}>
                  බෝගය: {stats.latestRecommendation.Crop_Type}
                </p>
                <p style={{ margin: '4px 0' }}>{stats.latestRecommendation.Watering_Advice}</p>
                <p style={{ margin: '4px 0' }}>{stats.latestRecommendation.Crop_Recommendation}</p>
                <p style={{ margin: '4px 0' }}>{stats.latestRecommendation.Pest_Advice}</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f0fdf4', padding: '18px', borderRadius: '12px', color: '#166534' }}>
                <p style={{ margin: 0, fontSize: '15px' }}>
                  🌿 අද දින ජලය සැපයීමේදී පසෙහි තෙතමනය පරීක්ෂා කර සැපයීම වඩාත් යෝග්‍ය වේ. නව නිර්දේශ ලබා ගැනීමට "Enter Data" වෙත යන්න.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}