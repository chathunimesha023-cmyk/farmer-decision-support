import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Farmer-ID');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navItems = [
    { label: '📊 Dashboard', path: '/dashboard' },
    { label: '🌱 Enter Data', path: '/input-data' },
    { label: '🤖 Agri ChatBot', path: '/chatbot' },
    { label: '📜 History', path: '/farm-history' },
  ];

  return (
    <div style={{
      width: '260px',
      minHeight: 'calc(100vh - 75px)',
      backgroundColor: '#1c3c1c',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: '#8fbc8f', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', paddingBottom: '12px', borderBottom: '1px solid #335533' }}>
          Farmer Portal 🌾
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/farm-history' && location.pathname === '/history');
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: isActive ? '#3d7a44' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background-color 0.2s',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button 
        onClick={handleSignOut} 
        style={{
          backgroundColor: '#c53030',
          color: '#fff',
          border: 'none',
          padding: '12px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '15px',
          marginTop: '20px'
        }}
      >
        Sign Out
      </button>
    </div>
  );
}