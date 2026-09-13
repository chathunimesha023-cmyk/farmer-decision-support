import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Get userName from LocalStorage
  const userName = localStorage.getItem('userName') || 'Farmer';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Farmer-ID');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Navbar Styles
  const navStyle = {
    backgroundColor: '#8fbc8f',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #557a55',
    width: '100%',
    height: '75px',
    boxSizing: 'border-box'
  };

 const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  padding: '0',
  margin: '0',
  border: 'none',
  width: '95px',
  height: '95px'
};

const logoImgStyle = {
  width: '105px',
  height: '105px',
  objectFit: 'contain',
  display: 'block',
  background: 'transparent',
  mixBlendMode: 'multiply'
};

  const linkBtnStyle = (path) => ({
    background: 'none',
    border: 'none',
    color: '#1c3c1c',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: location.pathname === path ? '3px solid #1c3c1c' : '3px solid transparent',
    padding: '6px 0',
    transition: '0.2s'
  });

  return (
    <nav style={navStyle}>
     {/* Logo & Title */}
<div style={logoContainerStyle}>
  <img
    src="/logo.png"
    alt="Farmer Decision Support"
    style={logoImgStyle}
  />
</div>

      {/* Navigation Links */}
      <div style={{ flex: 1, display: 'flex', gap: '30px', marginLeft: '40px' }}>
        <button onClick={() => navigate('/home')} style={linkBtnStyle('/home')}>Home</button>
        <button onClick={() => navigate('/dashboard')} style={linkBtnStyle('/dashboard')}>Dashboard</button>
      </div>

      {/* Sign out / Login */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {token ? (
          <>
            <span style={{ fontWeight: 'bold', color: '#1c3c1c', marginRight: '15px' }}>Hi, {userName}</span>
            <button 
              onClick={handleLogout} 
              style={{ padding: '8px 16px', backgroundColor: '#c53030', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            style={{ padding: '8px 18px', backgroundColor: '#3d7a44', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}